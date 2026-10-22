# Fonctions

## Fonctions déclaratives

On déclare une fonction à l'aide du mot clé **function**. Une fonction peut posséder un ou plusieurs **paramètres** (optionnels), séparés par des virgules.

Les **paramètres** sont les variables définies dans la fonction. Les **arguments** sont les valeurs effectivement passées lors de l'appel de la fonction.

Le mot clé **return** (optionnel) permet de retourner une valeur ; sans lui la fonction renvoie `undefined`. Les fonctions déclaratives sont _hissées (hoisting)_ ; elles peuvent être invoquées avant leur déclaration dans le code.

```js
function add(a, b) {
  return a + b
}
```

## Expressions de fonction

Une _expression de fonction_ ou _fonction anonyme_ est une fonction sans nom assignée à une variable. Contrairement aux fonctions déclaratives, elles ne sont pas _hissées_ et ne peuvent pas être invoquées avant leur déclaration.

```js
const add = function (a, b) {
  return a + b
}
```

## Fonctions fléchées

Une fonction fléchée est une syntaxe raccourcie pour écrire une expression de fonction, à l'aide de `=>`. Comme les fonctions anonymes, elles ne sont pas _hissées_. Elles ne possèdent pas leur propre contexte `this`, ce qui les distingue des fonctions classiques. Si le corps ne contient qu'une seule expression, on peut omettre les accolades et le mot clé **return** (retour implicite) :

```js
const add = (a, b) => a + b

// Avec un seul paramètre, les parenthèses sont également optionnelles :
const double = (x) => x * 2
```

## Méthodes

Quand une fonction est assignée comme propriété d'un objet, on l'appelle une **méthode**. On peut utiliser une expression de fonction ou la syntaxe raccourcie ES6 (sans le mot clé `function`) :

```js
const calculator = {
  add: function (a, b) {
    return a + b
  },
  // Syntaxe raccourcie (ES6)
  subtract(a, b) {
    return a - b
  },
}

calculator.add(2, 3) // 5
calculator.subtract(5, 2) // 3
```

Les fonctions fléchées ne sont pas adaptées comme méthodes car elles n'ont pas leur propre `this`.

## Le mot clé `this`

`this` désigne l'objet depuis lequel la fonction est appelée (le **contexte d'appel**).

Dans une méthode, `this` référence l'objet qui contient la méthode :

```js
const user = {
  name: "John",
  greet() {
    return `Bonjour, je m'appelle ${this.name}`
  },
}
```
