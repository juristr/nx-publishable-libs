# Angular Library distribution with Nx

## Angular Libraries with multiple entry points

This is similar to how Angular Material for instance is being distributed. You have **one** publishable library (e.g. `@myorg/thelib`), but each package in there has it's own entry point. As such, developers might import things like

```typescript
import { FooModule } from '@myorg/thelib/foo';
import { BarModule } from '@myorg/thelib/bar';
```

### Commands to reproduce

Generate the library

```
$ npx nx generate @nrwl/angular:library --name=thelib --importPath=@myorg/thelib --publishable
```

The library needs to be reorganized a bit in order to have multiple entry points.

#### Delete the main ng module

In our case we don't need the `libs/thelib/src/lib/thelib.module.ts` any more. We're going to expose a module per entry point.

#### Change the source root

Change the `sourceRoot` from pointing to the libs `src` folder to the `root` in `angular.json`

```json
...
"thelib": {
  "projectType": "library",
  "root": "libs/thelib",
  "sourceRoot": "libs/thelib",
  "prefix": "myorg",
  ...
},
...
```

The reason is that we don't want secondary entry points to live within the `src` folder, as otherwise the final production bundle import path would look like `@myorg/thelib/src/foo`.

### Generating a new entry point component

This repo contains a Nx [workspace generator](https://nx.dev/latest/angular/workspace/workspace-generator#workspace-generator) to help generating new entry points with components that get exposed

```
$ npx nx workspace-generator thelib-component foo
```

### Building the library

Executing this command will create a publishable package.

```
$ npx nx build thelib --configuration=production
```

In the `dist` folder you should see the built result which can be published to npm or whatever package registry you'd like.

### Using the library in the demoapp within the monorepo

You can also reference the library directly from within your apps in the monorepo. In order to do so you can change the TS path mappings in `tsconfig.base.json` in order to account for the secondary entry points.

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    ...
    "paths": {
      "@myorg/thelib/*": ["libs/thelib/*"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

After that, you should be able to reference the libs in the `demoapp/../app.module.ts`

```
...
import { TheLibFooModule } from '@myorg/thelib/foo';
import { TheLibBarModule } from '@myorg/thelib/bar';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TheLibFooModule, TheLibBarModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Consuming the production bundle

**Note,** with the previously described approach, the libraries are being consumed by webpack directly from the source. Usually that is enough and allows for a better developer experience in that you get live refresh during development. If you want to consume the libs from the production bundle, change the path mapping to

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    ...
    "paths": {
      "@myorg/thelib/*": ["dist/libs/thelib/*"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

That requires rebuild of the library on every change. (Passing `--watch` on the building of the library doesn't seem to work due to Ivy ngcc compilation erroring).
