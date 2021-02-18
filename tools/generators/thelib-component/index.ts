import {} from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { formatFiles, names, readWorkspace } from '@nrwl/workspace';

interface Schema {
  name: string;
}

export default function (schema: Schema): Rule {
  return (tree: Tree) => {
    const project = 'thelib';
    const workspace = readWorkspace(tree);
    const tmoComponentsPath = workspace.projects[project].sourceRoot;

    const moduleNames = names(schema.name);
    const newModulePath = `${tmoComponentsPath}/${moduleNames.fileName}`;
    const moduleName = `TheLib${moduleNames.className}Module`;

    const template = apply(url('./files'), [
      applyTemplates({
        ...moduleNames,
        moduleName,
      }),
      move(tmoComponentsPath),
    ]);

    return chain([
      mergeWith(template, MergeStrategy.Overwrite),
      externalSchematic('@schematics/angular', 'component', {
        name: schema.name,
        path: newModulePath,
        flat: true,
        export: true,
        style: 'scss',
        prefix: 'myorg',
      }),
      formatFiles(),
    ]);
  };
}
