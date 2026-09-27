# Types particuliers

## Type _any_

Le type `any` permet de désactiver la vérification de type sur une variable. Elle peut alors recevoir n'importe quelle valeur, de n'importe quel type, sans jamais générer d'erreur.

```ts
let data: any = 25
data = "twenty" // OK, aucune erreur
data = true // OK aussi
data = { name: "Alice" } // OK aussi
```

::: warning Avertissement
Cela annule l'intérêt même du langage : les erreurs qu'il devrait détecter à l'écriture du code ne le seront plus. À n'utiliser qu'en dernier recours.
:::

## Type _unknown_

Le type `unknown` accepte lui aussi n'importe quelle valeur, comme `any`, mais c'est son alternative sûre : contrairement à `any`, TypeScript interdit ensuite d'utiliser cette valeur tant que son type n'a pas été vérifié. Pour pouvoir l'utiliser, il faut d'abord faire du _narrowing_ vers un type précis, par exemple avec `typeof`.

```ts
let data: unknown = 25
data = "twenty" // OK, aucune erreur
data = true // OK aussi

data.toUpperCase() // [!code error] Erreur, `data` est de type `unknown`

if (typeof data === "string") {
    data.toUpperCase() // OK, TypeScript sait que `data` est une string ici
}
```

::: warning Narrowing
Le _narrowing_ (« resserrement ») désigne le fait de réduire le type d'une variable à un type plus précis, à l'intérieur d'un bloc de code, grâce à une vérification comme `typeof` ou une comparaison directe.
:::

## Type _union_

Le type union, avec le symbole `|`, permet à une variable d'accepter plusieurs types précis. Contrairement à `any`, TypeScript continue de vérifier que la valeur correspond bien à l'un des types autorisés.

```ts
let id: string | number

id = 42 // OK
id = "abc123" // OK
id = true // Erreur [!code error]
```

## Type _empty object_

Le type `{}`, malgré son nom d'_objet vide_, n'est pas propre aux objets. C'est un type à part entière, utilisable partout, qui signifie n'importe quelle valeur sauf `null` et `undefined`.

```ts
let obj: {} = { name: "Alice" }

obj = "hello" // OK ?!
obj = 42 // OK ?!
obj = null // Erreur [!code error]
obj = undefined // Erreur [!code error]
```

## Type _enum_

Un `enum` permet de définir un ensemble fixe de valeurs nommées, quand on veut représenter un choix parmi une liste connue à l'avance.

```ts
enum State {
    Active,
    Inactive,
    Waiting,
}

// `State` est un nouveau type, utilisable comme n'importe quel autre type
let s: State
s = State.Active // OK
s = "active" // Erreur [!code error] — il faut passer par State.Active
```

Par défaut, chaque membre reçoit une valeur numérique automatique (0, 1, 2...), mais on peut aussi assigner des valeurs explicites, notamment des chaînes :

```ts
enum Color {
    Red = "#ff0000",
    Green = "#00ff00",
    Blue = "#0000ff",
}
```

## Type _literal_

Un type _literal_ restreint une variable à une ou plusieurs valeurs exactes, plutôt qu'à un type large comme `string`. Cela fonctionne aussi avec des nombres ou des booléens.

```ts
let direction: "left" | "right"
direction = "left" // OK
direction = "right" // OK
direction = "up" // Erreur [!code error]

let diceRoll: 1 | 2 | 3 | 4 | 5 | 6
diceRoll = 4 // OK
diceRoll = 7 // Erreur [!code error]
```

::: tip Astuce
Le type _literal_ est une alternative plus légère au type _enum_ pour représenter un ensemble de valeurs fixes : aucun objet généré à l'exécution, juste une vérification au niveau du typage.
:::

## Type _aliases_

Le mot-clé `type` permet de nommer un type composé, pour le réutiliser sans avoir à le répéter partout. C'est particulièrement utile pour les objets, pour éviter de réutiliser la même structure à chaque déclaration.

```ts
type Direction = "left" | "right"
type User = { name: string; age: number; facing: Direction }

let user1: User = { name: "Alice", age: 25, facing: "left" }
let user2: User = { name: "Bob", age: 30, facing: "up" } // Erreur [!code error]
```
