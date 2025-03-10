import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RetrySettings {
  maxRetries: number;
  retryDelay: number;
  delayType: "exponential" | "linear";
}

class ApiInstance {
  private client: AxiosInstance;
  private authorization?: { value: string };

  constructor(
    baseURL: string,
    timeout: number,
    authorization?: { value: string }
  ) {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: timeout,
    });

    this.authorization = authorization;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest(
    config: AxiosRequestConfig,
    retryCount: number,
    settings: RetrySettings
  ): Promise<AxiosResponse> {
    try {
      return await this.client(config);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (retryCount < settings.maxRetries) {
        await this.delay(
          settings.delayType === "exponential"
            ? settings.retryDelay * retryCount
            : settings.retryDelay
        );
        return this.retryRequest(config, retryCount + 1, settings);
      }
      throw new Error(
        `${error.message}.
${error.response?.data?.title ?? error.response?.data?.message ?? ""}
'${this.client.defaults.baseURL}/${config.url}' API request failed`
      );
    }
  }

  public getClientBaseUrl(): string | undefined {
    return this.client.defaults.baseURL;
  }

  public getClientTimeout(): number{
    return this.client.defaults.timeout ?? 30000;
  }

  public async get<T>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any>,
    options: {
      bearerToken?: string;
      settings?: RetrySettings;
    }
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url,
      method: "get",
      params,
    };

    if (this.authorization)
      config.headers = {
        Authorization: "Bearer " + this.authorization.value,
      };

    if (options.bearerToken)
      config.headers = {
        Authorization: "Bearer " + options.bearerToken,
      };

    return await this.retryRequest(
      config,
      0,
      options.settings
        ? options.settings
        : {
          maxRetries: 3,
          retryDelay: 5000,
          delayType: "linear",
        }
    );
  }

  public async post<B, T>(
    url: string,
    body: B,
    options: {
      bearerToken?: string;
      settings?: RetrySettings;
    }
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url,
      method: "post",
      data: body,
    };

    if (this.authorization)
      config.headers = {
        Authorization: "Bearer " + this.authorization.value,
      };

    if (options.bearerToken)
      config.headers = {
        Authorization: "Bearer " + options.bearerToken,
      };

    return await this.retryRequest(
      config,
      0,
      options.settings
        ? options.settings
        : {
          maxRetries: 0,
          retryDelay: 0,
          delayType: "linear",
        }
    );
  }

  public async put<B, T>(
    url: string,
    body: B,
    options: {
      bearerToken?: string;
      settings?: RetrySettings;
    }
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url,
      method: "put",
      data: body,
    };

    if (this.authorization)
      config.headers = {
        Authorization: "Bearer " + this.authorization.value,
      };

    if (options.bearerToken)
      config.headers = {
        Authorization: "Bearer " + options.bearerToken,
      };

    return await this.retryRequest(
      config,
      0,
      options.settings
        ? options.settings
        : {
          maxRetries: 0,
          retryDelay: 0,
          delayType: "linear",
        }
    );
  }

  public async delete<T>(
    url: string,
    options: {
      bearerToken?: string;
      settings?: RetrySettings;
    }
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url,
      method: "delete",
    };

    if (this.authorization)
      config.headers = {
        Authorization: "Bearer " + this.authorization.value,
      };

    if (options.bearerToken)
      config.headers = {
        Authorization: "Bearer " + options.bearerToken,
      };

    return await this.retryRequest(
      config,
      0,
      options.settings
        ? options.settings
        : {
          maxRetries: 0,
          retryDelay: 0,
          delayType: "linear",
        }
    );
  }
}

export { ApiInstance };