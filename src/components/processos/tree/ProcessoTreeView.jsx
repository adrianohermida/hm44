import React from 'react';
import ProcessoTreeNode from './ProcessoTreeNode';

export default function ProcessoTreeView({ processos, onSelect }) {
  const buildTree = (items) => {
    const map = {};
    const roots = [];

    items.forEach(p => { map[p.id] = { ...p, children: [] }; });
    items.forEach(p => {
      if (p.processo_pai_id && map[p.processo_pai_id]) {
        map[p.processo_pai_id].children.push(map[p.id]);
      } else {
        roots.push(map[p.id]);
      }
    });

    return roots;
  };

  const renderNode = (node) => (
    <ProcessoTreeNode
      key={node.id}
      processo={node}
      onSelect={onSelect}
      children={node.children?.map(renderNode)}
    />
  );

  const tree = buildTree(processos);

  return (
    <div className="space-y-2">
      {tree.map(renderNode)}
    </div>
  );
}