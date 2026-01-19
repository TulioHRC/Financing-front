import {
  Modal,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FinancingApi } from "../../services/financing-server/financing-api";

interface Investment {
  id: string;
  name: string;
  type: string;
  price: number | null;
  status?: "UPDATED" | "ERROR" | "UPDATING" | "PENDING";
}

interface UpdatePricesModalProps {
  open: boolean;
  onClose: () => void;
  investments: Investment[];
}

export const UpdatePricesModal: React.FC<UpdatePricesModalProps> = ({
  open,
  onClose,
  investments: initialInvestments,
}) => {
  const [investments, setInvestments] = useState<Investment[]>([]);

  useEffect(() => {
    if (open) {
      setInvestments(
        initialInvestments.map((inv) => ({ ...inv, status: "PENDING" }))
      );
    }
  }, [open, initialInvestments]);

  const handleUpdateAll = async () => {
    const financingApiService = new FinancingApi();

    setInvestments((current) =>
      current.map((inv) => ({ ...inv, status: "UPDATING" }))
    );

    for (const investment of investments) {
      try {
        const externalValue = await financingApiService.prices.getFromExternalApi({
          params: {investimentId: investment.id}
        });

        if (!externalValue) throw new Error("No external api value found!");

        await financingApiService.prices.post({
          body: {
            investiment_id: investment.id,
            price: externalValue.quotation,
          },
        });

        setInvestments((current) =>
          current.map((inv) =>
            inv.id === investment.id
              ? { ...inv, status: "UPDATED", price: externalValue.quotation }
              : inv
          )
        );
      } catch (error) {
        console.error(`Failed to update ${investment.name}`, error);
        setInvestments((current) =>
          current.map((inv) =>
            inv.id === investment.id ? { ...inv, status: "ERROR" } : inv
          )
        );
      }
    };
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "80vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" mb={2}>
          Investments status
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {investments.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>{inv.name}</TableCell>
                <TableCell>{inv.type}</TableCell>
                <TableCell align="right">{inv.price ?? "—"}</TableCell>
                <TableCell>{inv.status ?? "PENDING"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
          <Button variant="contained" onClick={handleUpdateAll}>
            Update via API
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};