import _ from 'lodash';

class WikistatsAPIClient {
  constructor (apisConfig) {
    this.metrics = apisConfig;
  }
  getData(metricConfig) {
    const metric = this.metrics[metricConfig.name];
    let url = WikistatsAPIClient.AQS_HOST + metric.endpoint;
    (url.match(/{{.*?}}/g) || []).forEach((k) => {
      const key = _.trim(k, '{}');
      url = url.replace(k, metricConfig[key]);
    });
    return fetch(url).then(response => response.json());
  }
} 

WikistatsAPIClient.AQS_HOST = 'https://wikimedia.org/api/rest_v1/metrics';

export default WikistatsAPIClient;
