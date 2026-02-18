import React from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';

export default function DynamicBreadcrumb({ moduleName, itemName }) {
  const items = [
    { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') }
  ];

  if (itemName) {
    items.push({ label: moduleName, url: createPageUrl(getModuleUrl(moduleName)) });
    items.push({ label: itemName });
  } else {
    items.push({ label: moduleName });
  }

  return <Breadcrumb items={items} />;
}

function getModuleUrl(moduleName) {
  const map = {
    'Provedores': 'AdminProvedores',
    'Endpoints': 'AdminEndpoints',
    'Precificador': 'Precificador',
    'Testar APIs': 'TesteEndpointPage',
    'Histórico': 'AdminTestes',
    'Alertas': 'ConfiguracaoAlertas'
  };
  return map[moduleName] || 'AdminProvedores';
}