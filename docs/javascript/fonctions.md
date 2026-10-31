# Déclaration de fonctions

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
```

## Paramètres par défaut

On peut donner une valeur par défaut à un paramètre avec `=`. Elle est utilisée quand l'argument n'est pas fourni (ou vaut `undefined`) :

```js
function greet(name = "inconnu") {
  return `Bonjour ${name}`
}

greet("Alice") // "Bonjour Alice"
greet() // "Bonjour inconnu"
```

Cela fonctionne aussi avec les fonctions fléchées :

```js
const power = (base, exponent = 2) => base ** exponent

power(3) // 9
power(3, 3) // 27
```

::: tip Astuce
On place de préférence les paramètres avec valeur par défaut en dernier.
:::

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

## Fonctions de rappel

En JavaScript, les fonctions sont des **valeurs** : on peut les stocker dans une variable, les passer en argument ou les retourner. Une **fonction de rappel** (_callback_) est une fonction passée en argument à une autre fonction, qui se charge de l'appeler au moment voulu.

Une fonction qui reçoit une fonction en argument ou en retourne une est appelée **fonction d'ordre supérieur** (_higher-order function_).

```js
const add = (a, b) => a + b

// `operation` est le paramètre qui reçoit le callback
function calculate(a, b, operation) {
  return operation(a, b)
}

calculate(2, 3, add) // 5
```

Ici, `calculate` est la fonction d'ordre supérieur et `add` est le callback.

::: warning Attention
On passe la **référence** de la fonction (`add`), sans parenthèses. Écrire `add()` l'exécuterait immédiatement et passerait son résultat.
:::
