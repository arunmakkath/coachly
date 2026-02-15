import { type SchemaTypeDefinition } from 'sanity';
import post from './schemas/post';
import category from './schemas/category';
import knowledgeDocument from './schemas/document';
import home from './schemas/home';
import settings from './schemas/settings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, category, knowledgeDocument, home, settings],
};
