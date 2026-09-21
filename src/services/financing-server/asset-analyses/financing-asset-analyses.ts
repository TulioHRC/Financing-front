import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingAssetAnalysesDeleteResponseDTO } from './dto/financing-asset-analyses.delete.response.dto';
import { FinancingAssetAnalysesPostBodyDTO } from './dto/financing-asset-analyses.post.body.dto';
import { FinancingAssetAnalysesPostResponseDTO } from './dto/financing-asset-analyses.post.response.dto';
import { FinancingAssetAnalysesPutByIdBodyDTO } from './dto/financing-asset-analyses.putById.body.dto';
import { AnalysisCategory } from './analysis-category';

export class FinancingAssetAnalysesService {
  private readonly client: ApiInstance;

  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/asset-analyses`, client.getClientTimeout());
  }

  async getById(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingAssetAnalysesPostResponseDTO> {
    return (await this.client.get<FinancingAssetAnalysesPostResponseDTO>(
      `${request.id}`,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }

  async post(
    request: {
      body: FinancingAssetAnalysesPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingAssetAnalysesPostResponseDTO> {
    return (await this.client.post<FinancingAssetAnalysesPostBodyDTO, FinancingAssetAnalysesPostResponseDTO>(
      ``,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }

  async putById(
    request: {
      id: string;
      body: FinancingAssetAnalysesPutByIdBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingAssetAnalysesPostResponseDTO> {
    return (await this.client.put<FinancingAssetAnalysesPutByIdBodyDTO, FinancingAssetAnalysesPostResponseDTO>(
      `${request.id}`,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }

  async updateCategoryScore(
    request: {
      id: string;
      category: AnalysisCategory;
      score: number;
      settings?: RetrySettings;
    }
  ): Promise<void> {
    await this.client.put<{ score: number }, unknown>(
      `${request.id}/categories/${request.category}`,
      { score: request.score },
      {
        settings: request.settings,
      }
    );
  }

  async deleteById(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingAssetAnalysesDeleteResponseDTO> {
    return (await this.client.delete<FinancingAssetAnalysesDeleteResponseDTO>(
      `${request.id}`,
      {
        settings: request.settings,
      }
    )).data;
  }
}
