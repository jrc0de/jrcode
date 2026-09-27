# Types primitifs

## Types _string_, _number_ et _boolean_

JavaScript possède trois types primitifs très couramment utilisés : `string`, `number` et `boolean`. Chacun possède un type correspondant en TypeScript, portant le même nom que celui renvoyé par l'opérateur `typeof` en JavaScript.

- `string` représente une chaîne de caractères, comme `"Hello, world"`
- `number` représente un nombre, comme `42`
- `boolean` représente l'une des deux valeurs `true` ou `false`

## Assignation de type

On peut déclarer une variable en précisant explicitement son type avec la syntaxe `variable: type`.

```ts
let age: number = 25
let name: string = "Alice"
let isActive: boolean = true
let year: number
let city: string
```

L'annotation de type garantit que la variable ne pourra jamais recevoir une autre valeur que celle du type déclaré :

```ts
let age: number = 25
age = "twenty" // Error [!code error]
```

## Inférence de type

TypeScript est capable de déduire le type d'une variable tout seul, à partir de la valeur assignée. Il n'est donc pas toujours nécessaire de le préciser.

```ts
let age = 25 // TypeScript déduit : number
let prenom = "Alice" // TypeScript déduit : string

// Le type est "verrouillé" ensuite même sans annotation explicite
age = "twenty" // Error [!code error]
```

## Types _null_ et _undefined_

JavaScript possède aussi les valeurs `null` et `undefined`, qui ont chacune leur propre type en TypeScript, portant le même nom.

- `undefined` représente une variable déclarée mais non initialisée
- `null` représente l'absence volontaire de valeur

```ts
let a: undefined = undefined
let b: null = null
```
