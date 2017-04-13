import Telemetry from 'telemetry-next-node';
import getVersions from '../release/versions';
import fetchJson from '../fetch/json';

Telemetry.getJSON = async (url, callback) => {
  const response = await fetchJson(url, { ttl: 'day' });
  callback(response);
};

let nextTelemetry = 0;
let initResolve = null;
function init() {
  if (Date.now() < nextTelemetry) {
    return Promise.resolve();
  }
  if (!initResolve) {
    console.log('Requesting init');
    initResolve = new Promise((resolve) => {
      Telemetry.init(() => {
        console.log('Init');
        initResolve = null;
        nextTelemetry = Date.now() + 3600;
        resolve();
      });
    });
  }
  return initResolve;
}

export async function getEvolution(query) {
  const {
    metric,
    channel = 'release',
    useSubmissionDate = true,
    version,
  } = query;
  delete query.metric;
  delete query.version;
  delete query.channel;
  delete query.useSubmissionDate;
  await init();
  const evolutionMap = await new Promise((resolve) => {
    console.log('Telemetry.getEvolution', channel, version);
    Telemetry.getEvolution(
      channel,
      String(parseInt(version, 10)),
      metric,
      query,
      useSubmissionDate,
      resolve,
    );
  });
  const keys = Object.keys(evolutionMap);
  if (keys.length > 1) {
    return keys.map((key) => {
      return {
        key: key,
        evolution: evolutionMap[key].sanitized(),
      };
    });
  } else if (evolutionMap['']) {
    return evolutionMap[''].sanitized();
  }
  return null;
}

export async function getLatestEvolution(query) {
  const versions = await getVersions();
  query.version = versions[query.channel];
  for (let i = 0; i < 3; i += 1) {
    const histogram = await getEvolution(Object.assign({
      version: query.version - 1,
    }, query));
    if (histogram) {
      return histogram;
    }
  }
  return null;
}

export async function getSummary(query) {
  const evolution = await getEvolution(query);
  const hist = evolution.histogram();
  return {
    mean: hist.mean(),
    median: hist.percentile(50),
    90: hist.percentile(90),
    95: hist.percentile(95),
    99: hist.percentile(99),
  };
}
