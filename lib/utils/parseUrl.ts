import querystring from "querystring";

function urlToQueryStrings(url: string): querystring.ParsedUrlQuery {
  return querystring.parse(url);
}

export { urlToQueryStrings };
