# Assertions de type

## Opérateur _non-null assertion_

TypeScript peut refuser d'utiliser une valeur potentiellement `null` ou `undefined`, même si on est certain qu'elle ne le sera pas à cet endroit précis du code. L'opérateur `!`, placé après une valeur, permet d'indiquer à TypeScript de ne pas tenir compte de ce risque.

```ts
function getLength(text: string | undefined) {
  return text!.length // on affirme que `text` ne sera pas undefined ici
}
```

::: warning Avertissement
`!` ne fait aucune vérification à l'exécution. À utiliser seulement quand on est vraiment certain de la valeur, sinon préférer une vérification explicite (`if (text) { ... }`).
:::

## Opérateur _type assertion_

L'opérateur `as` permet d'indiquer à TypeScript de traiter une valeur comme un type différent de celui qu'il aurait déduit, sans conversion réelle à l'exécution.

```ts
let value: unknown = "hello"
let length = (value as string).length
```

::: warning Avertissement
`as` ne fait aucune vérification à l'exécution. Si le type annoncé est faux, aucune erreur n'est levée à l'écriture, mais le code peut planter à l'exécution.
:::
