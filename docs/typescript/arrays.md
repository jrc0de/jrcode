# Tableaux

## Assignation de type

Pour typer un tableau, on précise le type des éléments qu'il contient, suivi de `[]`.

```ts
let cards: number[] = [1, 2, 3]
let names: string[] = ["Alice", "Bob"]

cards.push(4) // OK
cards.push("King") // Error [!code error]
```

## Inférence de type

Comme pour les variables simples, TypeScript est capable de déduire le type d'un tableau à partir des valeurs qu'il contient au moment de sa déclaration.

```ts
let cards = [1, 2, 3] // TypeScript déduit : number[]
let names = ["Alice", "Bob"] // TypeScript déduit : string[]

cards.push(4) // OK
cards.push("King") // Error [!code error]
```

::: tip Conseil
Si un tableau est déclaré vide sans annotation, comme `let items = []`, TypeScript lui donne le type `any[]`, ce qui désactive la vérification de type sur ses éléments. Il est donc préférable de toujours annoter les tableaux vides, par exemple `let items: string[] = []`.
:::

## Type _union_

On peut aussi combiner plusieurs types dans un tableau grâce au type union :

```ts
let mix: (string | number)[] = [1, "two", 3]
```

## Syntaxe alternative

Il existe une syntaxe alternative avec `Array<type>`, appelée syntaxe générique. Elle est strictement équivalente à `type[]`, c'est simplement une question de préférence stylistique.

```ts
let cards: Array<number> = [1, 2, 3]
let names: Array<string> = ["Alice", "Bob"]
let mix: Array<string | number> = [1, "two", 3]
```

## Les tuples

Un tuple est un tableau de longueur fixe où le type de chaque position est défini précisément, contrairement à `number[]` où tous les éléments sont du même type et la longueur est libre. C'est utile quand on veut représenter une structure fixe, comme une paire clé/valeur ou des coordonnées

```ts
let user: [string, number] = ["Alice", 25]

user = [25, "Alice"] // Error [!code error]
user = ["Alice", 25, true] // Error [!code error]
```

::: warning Avertissement
TypeScript n'empêche pas d'appeler `.push()` sur un tuple. C'est une limitation connue du système de types à garder en tête.
:::
