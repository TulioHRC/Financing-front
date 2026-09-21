import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { financingApi } from "../../services/financing-server/financing-api";
import { useWatchlistFormData } from "../../hooks/useWatchlistFormData";
import { ANALYSIS_CATEGORIES, AnalysisCategory } from "../../services/financing-server/asset-analyses/analysis-category";
import { ASSET_VERDICTS, AssetVerdict } from "../../services/financing-server/asset-analyses/asset-verdict";
import {
  CATEGORY_GUIDANCE,
  CATEGORY_INDICATOR_SUGGESTIONS,
} from "../../services/financing-server/asset-analyses/category-guidance";
import StarRating from "../../components/star-rating/StarRating";
import Tooltip from "../../components/tooltip/Tooltip";
import {
  Container,
  HeaderSection,
  TitleContainer,
  Title,
  Subtitle,
  FormCard,
  FieldRow,
  Field,
  Label,
  StyledInput,
  StyledTextarea,
  CategoryGrid,
  CategoryCard,
  CategoryHeader,
  SubmitButton,
  VerdictSelectorRow,
  VerdictOption,
  IndicatorsList,
  IndicatorRow,
  IndicatorInput,
  RemoveIndicatorButton,
  AddIndicatorButton,
  IndicatorLabel,
  ErrorMessage,
} from "./styles/styled-components";

interface IndicatorFormState {
  name: string;
  value: string;
  unit: string;
}

interface CategoryFormState {
  category: AnalysisCategory;
  score: number;
  comment: string;
  indicators: IndicatorFormState[];
}

const buildEmptyCategories = (): CategoryFormState[] =>
  ANALYSIS_CATEGORIES.map((c) => ({ category: c.key, score: 3, comment: "", indicators: [] }));

const todayDateInputValue = () => new Date().toISOString().slice(0, 10);

const AssetAnalysisForm: React.FC = () => {
  const { assetId, analysisId } = useParams<{ assetId?: string; analysisId?: string }>();
  const navigate = useNavigate();
  const isNewAsset = !assetId;

  const { data: formData } = useWatchlistFormData();

  const [assetName, setAssetName] = useState<string>("");
  const [existingAssetId, setExistingAssetId] = useState<string>("");
  const [assetFields, setAssetFields] = useState({
    name: "",
    asset_type: "",
    segment: "",
    description: "",
    investiment_name: "",
    investiment_id: "",
  });
  const [date, setDate] = useState(todayDateInputValue());
  const [observations, setObservations] = useState("");
  const [verdict, setVerdict] = useState<AssetVerdict | undefined>(undefined);
  const [categories, setCategories] = useState<CategoryFormState[]>(buildEmptyCategories());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (assetId) {
      financingApi.watchlistAssets.getById({ id: assetId }).then((asset) => setAssetName(asset.name));
    }
  }, [assetId]);

  useEffect(() => {
    if (analysisId) {
      financingApi.assetAnalyses.getById({ id: analysisId }).then((analysis) => {
        setDate(analysis.date.slice(0, 10));
        setObservations(analysis.observations ?? "");
        setVerdict(analysis.verdict ?? undefined);
        setCategories(
          ANALYSIS_CATEGORIES.map((c) => {
            const existing = analysis.categories.find((cat) => cat.category === c.key);
            return {
              category: c.key,
              score: existing?.score ?? 3,
              comment: existing?.comment ?? "",
              indicators:
                existing?.indicators.map((i) => ({
                  name: i.name,
                  value: String(i.value),
                  unit: i.unit ?? "",
                })) ?? [],
            };
          })
        );
      });
    }
  }, [analysisId]);

  const updateCategory = (category: AnalysisCategory, patch: Partial<CategoryFormState>) => {
    setCategories((prev) => prev.map((c) => (c.category === category ? { ...c, ...patch } : c)));
  };

  const addIndicator = (category: AnalysisCategory, preset?: { name: string; unit: string }) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.category === category
          ? {
            ...c,
            indicators: [
              ...c.indicators,
              { name: preset?.name ?? "", value: "", unit: preset?.unit ?? "" },
            ],
          }
          : c
      )
    );
  };

  const updateIndicator = (category: AnalysisCategory, index: number, patch: Partial<IndicatorFormState>) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.category === category
          ? {
            ...c,
            indicators: c.indicators.map((ind, i) => (i === index ? { ...ind, ...patch } : ind)),
          }
          : c
      )
    );
  };

  const removeIndicator = (category: AnalysisCategory, index: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.category === category
          ? { ...c, indicators: c.indicators.filter((_, i) => i !== index) }
          : c
      )
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let targetAssetId = assetId;

      if (isNewAsset) {
        if (existingAssetId) {
          targetAssetId = existingAssetId;
        } else {
          const created = await financingApi.watchlistAssets.post({
            body: {
              name: assetFields.name,
              asset_type: assetFields.asset_type,
              segment: assetFields.segment || undefined,
              description: assetFields.description || undefined,
              investiment_id: assetFields.investiment_id || undefined,
            },
          });
          targetAssetId = created.id;
        }
      }

      const payload = {
        date: new Date(date),
        observations: observations || undefined,
        verdict,
        categories: categories.map((c) => ({
          category: c.category,
          score: c.score,
          comment: c.comment,
          indicators: c.indicators
            .filter((i) => i.name.trim() !== "" && i.value.trim() !== "")
            .map((i) => ({
              name: i.name.trim(),
              value: Number(i.value),
              unit: i.unit.trim() || undefined,
            })),
        })),
      };

      if (analysisId) {
        await financingApi.assetAnalyses.putById({ id: analysisId, body: payload });
        navigate(`/watchlist/${assetId}`);
      } else {
        await financingApi.assetAnalyses.post({
          body: { watchlist_asset_id: targetAssetId as string, ...payload },
        });
        navigate(`/watchlist/${targetAssetId}`);
      }
    } catch (error) {
      // ApiInstance formats errors as "<generic message>.\n<backend message>\n'<url>' ...",
      // the backend message (line 2) is the useful, human-readable part.
      const backendMessage = error instanceof Error ? error.message.split("\n")[1]?.trim() : "";
      setSubmitError(backendMessage || "Failed to save this analysis. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isNewAsset
    ? assetFields.name !== "" &&
      (existingAssetId !== "" || assetFields.asset_type !== "") &&
      !isSubmitting
    : !isSubmitting;

  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>{analysisId ? "Edit Analysis" : "New Analysis"}</Title>
          <Subtitle>
            {isNewAsset ? "Add a new asset to your watchlist" : `For ${assetName || "..."}`}
          </Subtitle>
        </TitleContainer>
      </HeaderSection>

      {isNewAsset && (
        <FormCard>
          <FieldRow>
            <Field>
              <Label htmlFor="asset-name">Name</Label>
              <StyledInput
                id="asset-name"
                type="text"
                list="asset-names"
                value={assetFields.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const ownedInvestiment = formData?.investiments.find((i) => i.name === name);
                  // A name match against the watchlist itself, or a match against an
                  // owned investment that's already linked to some other watchlist
                  // entry, both mean "this isn't a new asset" — the backend enforces
                  // one watchlist asset per investment, so without this check the
                  // create call below would fail with a unique constraint error.
                  const existingWatchlistAsset =
                    formData?.watchlistAssets.find((a) => a.name === name) ??
                    formData?.watchlistAssets.find((a) => a.investiment_id === ownedInvestiment?.id);

                  if (existingWatchlistAsset) {
                    setExistingAssetId(existingWatchlistAsset.id);
                    setAssetFields((prev) => ({
                      ...prev,
                      name,
                      asset_type: existingWatchlistAsset.asset_type,
                      segment: existingWatchlistAsset.segment ?? "",
                      description: existingWatchlistAsset.description ?? "",
                      investiment_id: existingWatchlistAsset.investiment_id ?? "",
                      investiment_name:
                        formData?.investiments.find((i) => i.id === existingWatchlistAsset.investiment_id)
                          ?.name ?? "",
                    }));
                  } else {
                    setExistingAssetId("");
                    setAssetFields((prev) => ({
                      ...prev,
                      name,
                      ...(ownedInvestiment
                        ? {
                          asset_type: ownedInvestiment.asset_type,
                          segment: ownedInvestiment.segment,
                          investiment_id: ownedInvestiment.id,
                          investiment_name: ownedInvestiment.name,
                        }
                        : {}),
                    }));
                  }
                }}
                placeholder="TRPL4 - ISA CTEEP"
              />
              <datalist id="asset-names">
                {[
                  ...(formData?.watchlistAssets.map((a) => a.name) ?? []),
                  ...(formData?.investiments.map((i) => i.name) ?? []),
                ]
                  .filter((value, index, arr) => arr.indexOf(value) === index)
                  .map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
              </datalist>
            </Field>
            {!existingAssetId && (
              <>
                <Field>
                  <Label htmlFor="asset-type">Type</Label>
                  <StyledInput
                    id="asset-type"
                    type="text"
                    list="asset-types"
                    value={assetFields.asset_type}
                    onChange={(e) => setAssetFields((prev) => ({ ...prev, asset_type: e.target.value }))}
                    placeholder="STOCK / FII / ETF"
                  />
                  <datalist id="asset-types">
                    {["STOCK", "FII", "ETF", ...(formData?.assetTypes ?? [])]
                      .filter((value, index, arr) => arr.indexOf(value) === index)
                      .map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </datalist>
                </Field>
                <Field>
                  <Label htmlFor="asset-segment">Segment</Label>
                  <StyledInput
                    id="asset-segment"
                    type="text"
                    list="asset-segments"
                    value={assetFields.segment}
                    onChange={(e) => setAssetFields((prev) => ({ ...prev, segment: e.target.value }))}
                  />
                  <datalist id="asset-segments">
                    {[
                      ...(formData?.investiments ?? []),
                      ...(formData?.watchlistAssets ?? []),
                    ]
                      .filter((a) => !assetFields.asset_type || a.asset_type === assetFields.asset_type)
                      .map((a) => a.segment)
                      .filter((segment): segment is string => !!segment)
                      .filter((value, index, arr) => arr.indexOf(value) === index)
                      .map((segment) => (
                        <option key={segment} value={segment}>
                          {segment}
                        </option>
                      ))}
                  </datalist>
                </Field>
              </>
            )}
          </FieldRow>

          {existingAssetId ? (
            <Subtitle>
              Using an existing watchlist asset {"—"} this will add a new analysis entry to it instead
              of creating a duplicate.
            </Subtitle>
          ) : (
            <>
              <Field>
                <Label htmlFor="asset-description">Description</Label>
                <StyledTextarea
                  id="asset-description"
                  rows={2}
                  value={assetFields.description}
                  onChange={(e) => setAssetFields((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Maior empresa privada transmissora de energia elétrica do Brasil."
                />
              </Field>
              <Field>
                <Label htmlFor="asset-investiment">Already own it? Link to your portfolio (optional)</Label>
                <StyledInput
                  id="asset-investiment"
                  type="text"
                  list="asset-investiments"
                  value={assetFields.investiment_name}
                  onChange={(e) =>
                    setAssetFields((prev) => ({
                      ...prev,
                      investiment_name: e.target.value,
                      investiment_id: formData?.investiments.find((i) => i.name === e.target.value)?.id ?? "",
                    }))
                  }
                />
                <datalist id="asset-investiments">
                  {formData?.investiments
                    .filter((inv) => !formData.watchlistAssets.some((a) => a.investiment_id === inv.id))
                    .map((inv) => (
                      <option key={inv.id} value={inv.name}>
                        {inv.name}
                      </option>
                    ))}
                </datalist>
              </Field>
            </>
          )}
        </FormCard>
      )}

      <FormCard>
        <FieldRow>
          <Field>
            <Label htmlFor="analysis-date">Date</Label>
            <StyledInput
              id="analysis-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </FieldRow>
        <Field>
          <Label>Verdict (optional)</Label>
          <VerdictSelectorRow>
            {ASSET_VERDICTS.map(({ key, label }) => (
              <VerdictOption
                key={key}
                type="button"
                $active={verdict === key}
                $verdict={key}
                onClick={() => setVerdict(verdict === key ? undefined : key)}
              >
                {label}
              </VerdictOption>
            ))}
          </VerdictSelectorRow>
        </Field>
      </FormCard>

      <CategoryGrid>
        {ANALYSIS_CATEGORIES.map(({ key, label }) => {
          const state = categories.find((c) => c.category === key) as CategoryFormState;
          const suggestions = CATEGORY_INDICATOR_SUGGESTIONS[key];
          const usedSuggestionNames = new Set(state.indicators.map((i) => i.name));

          return (
            <CategoryCard key={key}>
              <CategoryHeader>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {label}
                  <Tooltip text={CATEGORY_GUIDANCE[key]} />
                </span>
                <span style={{ fontSize: "20px" }}>
                  <StarRating value={state.score} onChange={(score) => updateCategory(key, { score })} />
                </span>
              </CategoryHeader>
              <StyledTextarea
                rows={3}
                placeholder={`Your notes about ${label.toLowerCase()}...`}
                value={state.comment}
                onChange={(e) => updateCategory(key, { comment: e.target.value })}
              />

              <IndicatorLabel>Indicators</IndicatorLabel>
              <IndicatorsList>
                {state.indicators.map((indicator, index) => (
                  <IndicatorRow key={index}>
                    <IndicatorInput
                      type="text"
                      list={`indicator-names-${key}`}
                      placeholder="Name (e.g. ROE)"
                      value={indicator.name}
                      onChange={(e) => updateIndicator(key, index, { name: e.target.value })}
                    />
                    <IndicatorInput
                      type="number"
                      placeholder="Value"
                      value={indicator.value}
                      onChange={(e) => updateIndicator(key, index, { value: e.target.value })}
                    />
                    <IndicatorInput
                      type="text"
                      placeholder="Unit"
                      value={indicator.unit}
                      onChange={(e) => updateIndicator(key, index, { unit: e.target.value })}
                    />
                    <RemoveIndicatorButton
                      type="button"
                      onClick={() => removeIndicator(key, index)}
                      aria-label="Remove indicator"
                    >
                      &times;
                    </RemoveIndicatorButton>
                  </IndicatorRow>
                ))}
                <datalist id={`indicator-names-${key}`}>
                  {suggestions.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </datalist>
              </IndicatorsList>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {suggestions
                  .filter((s) => !usedSuggestionNames.has(s.name))
                  .map((s) => (
                    <AddIndicatorButton key={s.name} type="button" onClick={() => addIndicator(key, s)}>
                      + {s.name}
                    </AddIndicatorButton>
                  ))}
                <AddIndicatorButton type="button" onClick={() => addIndicator(key)}>
                  + Custom indicator
                </AddIndicatorButton>
              </div>
            </CategoryCard>
          );
        })}
      </CategoryGrid>

      <FormCard>
        <Field>
          <Label htmlFor="observations">Observations</Label>
          <StyledTextarea
            id="observations"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </Field>
      </FormCard>

      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

      <SubmitButton disabled={!canSubmit} onClick={handleSubmit}>
        {isSubmitting ? "Saving..." : "Save Analysis"}
      </SubmitButton>
    </Container>
  );
};

export default AssetAnalysisForm;
