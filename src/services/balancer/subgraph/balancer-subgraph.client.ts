import axios from 'axios';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { configService as _configService } from '@/services/config/config.service';

export default class BalancerSubgraphClient {
  url: string;

  constructor(private readonly configService = _configService) {
    this.url = configService.network.subgraph;
  }

  public async get(query) {
    try {
      const payload = this.toPayload(query);
      const {
        data: { data }
      } = await axios.post(this.url, payload);
      return data; // HOLDR_TODO: aurora or mumbai subgraph is not keeping track of pool snapshots from last 30 days, thus values are null
    } catch (error) {
      console.error(error);
    }
  }

  public toPayload(query) {
    return JSON.stringify({ query: jsonToGraphQLQuery({ query }) });
  }
}

export const balancerSubgraphClient = new BalancerSubgraphClient();
