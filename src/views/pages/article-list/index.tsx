import { Renderer, Conditions } from './renderer';
import { useLocation } from 'react-router-dom';

export function ArticleList() {
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const parkParam = query.get('park');

  const conditions: Conditions = {
    category: query.get('category') ? Number(query.get('category')) : undefined,
    park: parkParam === 'L' || parkParam === 'S' ? parkParam : undefined,
    keywords: query.get('keywords')?.split(','),
  };

  return <Renderer initialSearchConditions={conditions} />;
}
