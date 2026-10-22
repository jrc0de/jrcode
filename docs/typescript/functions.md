# Fonctions

## Assignation de type

On peut typer les paramètres d'une fonction avec la même syntaxe que pour les variables simples.

```ts
function add(a: number, b = 5) {
  return a + b
}
```

## Paramètres optionnels

Un paramètre peut être rendu optionnel avec `?`, à condition d'être placé après les paramètres obligatoires.

```ts
function greet(name: string, greeting?: string) {
  return `${greeting ?? "Bonjour"}, ${name}`
}

greet("Alice") // OK
greet("Alice", "Salut") // OK
```

## Type _union_

```ts
function afficherId(id: string | number) {
  console.log("Votre ID est : " + id)
}

afficherId(101) // OK
afficherId("101") // OK
afficherId(true) // Error [!code error]
```

## Typage du retour

On peut aussi typer la valeur renvoyée par une fonction, en ajoutant l'annotation après la liste des paramètres. En général, TypeScript est capable d'inférer le type de retour. Il n'est donc pas toujours nécessaire de l'annoter explicitement.

```ts
function add(a: number, b: number): number {
  return a + b
}
```

## Type _void_

Le type `void` représente le type de retour d'une fonction qui ne renvoie rien (pas de `return`, ou un `return` sans valeur). Il ne s'utilise que pour un type de retour, jamais pour typer une variable ou un paramètre.

```ts
function log(message: string): void {
  console.log(message)
}

let result = log("Hello") // result vaut undefined, mais typé void
```

## Type _never_

Le type `never` représente le type de retour d'une fonction qui ne se termine jamais normalement : soit elle lève systématiquement une erreur, soit elle contient une boucle infinie. Contrairement à `void`, une fonction typée `never` ne renvoie littéralement aucune valeur, même pas `undefined`.

```ts
function fail(message: string): never {
  throw new Error(message)
}
```

## Type _fonction_

On peut typer une variable comme étant elle-même une fonction, en précisant le type de ses paramètres et de son retour.

```ts
let addition: (a: number, b: number) => number

addition = (a, b) => a + b // OK, TypeScript infère les types de a et b
```

Cette syntaxe est très utile pour typer un paramètre qui attend lui-même une fonction, comme un callback.

```ts
function repeter(n: number, action: (index: number) => void) {
  for (let i = 0; i < n; i++) {
    action(i)
  }
}

repeter(3, (i) => console.log("Itération " + i))
```
