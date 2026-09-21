import { ApiInstance, RetrySettings } from '../../api-instance';
import { FinancingWatchlistAssetsDeleteResponseDTO } from './dto/financing-watchlist-assets.delete.response.dto';
import { FinancingWatchlistAssetsGetResponseDTO } from './dto/financing-watchlist-assets.get.response.dto';
import { FinancingWatchlistAssetsPostBodyDTO } from './dto/financing-watchlist-assets.post.body.dto';
import { FinancingWatchlistAssetsPostResponseDTO } from './dto/financing-watchlist-assets.post.response.dto';
import { FinancingWatchlistAssetsPutByIdBodyDTO } from './dto/financing-watchlist-assets.putById.body.dto';
import { FinancingWatchlistAssetsComparisonResponseDTO } from './dto/financing-watchlist-assets.comparison.response.dto';
import { FinancingWatchlistAssetsAnalysesResponseDTO } from './dto/financing-watchlist-assets.analyses.response.dto';

export class FinancingWatchlistAssetsService {
  private readonly client: ApiInstance;

  constructor(client: ApiInstance) {
    this.client = new ApiInstance(`${client.getClientBaseUrl()}/watchlist-assets`, client.getClientTimeout());
  }

  async get(
    request: {
      settings?: RetrySettings;
    } = {}
  ): Promise<FinancingWatchlistAssetsGetResponseDTO> {
    return (await this.client.get<FinancingWatchlistAssetsGetResponseDTO>(
      ``,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }

  async getById(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingWatchlistAssetsPostResponseDTO> {
    return (await this.client.get<FinancingWatchlistAssetsPostResponseDTO>(
      `${request.id}`,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }

  async post(
    request: {
      body: FinancingWatchlistAssetsPostBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingWatchlistAssetsPostResponseDTO> {
    return (await this.client.post<FinancingWatchlistAssetsPostBodyDTO, FinancingWatchlistAssetsPostResponseDTO>(
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
      body: FinancingWatchlistAssetsPutByIdBodyDTO;
      settings?: RetrySettings;
    }
  ): Promise<FinancingWatchlistAssetsPostResponseDTO> {
    return (await this.client.put<FinancingWatchlistAssetsPutByIdBodyDTO, FinancingWatchlistAssetsPostResponseDTO>(
      `${request.id}`,
      request.body,
      {
        settings: request.settings,
      }
    )).data;
  }

  async deleteById(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingWatchlistAssetsDeleteResponseDTO> {
    return (await this.client.delete<FinancingWatchlistAssetsDeleteResponseDTO>(
      `${request.id}`,
      {
        settings: request.settings,
      }
    )).data;
  }

  async getComparison(
    request: {
      settings?: RetrySettings;
    } = {}
  ): Promise<FinancingWatchlistAssetsComparisonResponseDTO> {
    return (await this.client.get<FinancingWatchlistAssetsComparisonResponseDTO>(
      `comparison`,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }

  async getAnalyses(
    request: {
      id: string;
      settings?: RetrySettings;
    }
  ): Promise<FinancingWatchlistAssetsAnalysesResponseDTO> {
    return (await this.client.get<FinancingWatchlistAssetsAnalysesResponseDTO>(
      `${request.id}/analyses`,
      {},
      {
        settings: request.settings,
      }
    )).data;
  }
}
