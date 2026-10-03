# Structures de contrôle

## Bloc conditionnel if...else

```js
if (/* condition 1 (Boolean) */) {
    // code à exécuter si condition 1 vraie
} else if (/* condition 2 (Boolean) */) {
    // code à exécuter si condition 2 vraie
} else {
    // code à exécuter dans tous les autres cas
}

// Si le code à exécuter tient sur une ligne on peut omettre les accolades
if (/* Boolean */) console.log(text)
```

## Bloc conditionnel switch

```js
switch (/* valeur à tester */) {
    case /* valeur 1 */:
        // code à exécuter si valeur === valeur 1
        break
    case /* valeur 2 */:
        // code à exécuter si valeur === valeur 2
        break
    default:
        // code à exécuter dans tous les autres cas
}
```

## Opérateur ternaire

```js
/* condition (Boolean) */ ? /* valeur si vrai */ : /* valeur si faux */
const statut = age >= 18 ? "majeur" : "mineur"
```

## Boucle for

La boucle `for` répète un bloc de code un nombre défini de fois. Elle se compose de trois parties : l'**initialisation** (exécutée une seule fois au départ), la **condition** (vérifiée avant chaque itération), et l'**incrément** (exécuté après chaque itération) :

```js
for (let i = 0; i < 10; i++) {
    // code à répéter
}
```

`continue` interrompt l'itération en cours et passe directement à la suivante. `break` sort complètement de la boucle :

```js
for (let i = 0; i < 10; i++) {
    if (i === 3) continue // saute le i === 3, passe à i === 4
    if (i === 7) break // arrête la boucle, i === 8, 9 ne sont jamais atteints
    console.log(i) // 0, 1, 2, 4, 5, 6
}
```

## Boucle while

La boucle `while` répète un bloc de code **tant qu'une condition est vraie**. Contrairement à la boucle `for`, elle est utilisée quand le nombre d'itérations n'est pas connu à l'avance :

```js
while (/* condition (Boolean) */) {
  // code à répéter
}
```

Les instructions `continue` et `break` fonctionnent de la même façon que dans une boucle `for`. La variante `do...while` garantit quant à elle une **première exécution systématique** du bloc, avant de vérifier la condition :

```js
do {
  // code à répéter
} while (/* condition (Boolean) */)
```

## Boucle for...of

La boucle `for...of` parcourt les **valeurs** d'un **itérable** (tableau, chaîne de caractères, `Map`, `Set`...), sans avoir à gérer d'indice :

```js
const fruits = ["pomme", "poire", "banane"]

for (const fruit of fruits) {
    console.log(fruit) // "pomme", "poire", "banane"
}
```

Un objet simple n'est **pas un itérable** : `for...of` lève une `TypeError`.

```js
const user = { nom: "Alice", age: 30 }

for (const x of user) {
} // TypeError: user is not iterable // [!code error]
```

Pour le parcourir, on parcourt plutôt un tableau dérivé de l'objet, obtenu avec l'une de ces trois méthodes :

```js
const user = { nom: "Alice", age: 30 }

// Les clés
for (const key of Object.keys(user)) {
    console.log(key) // "nom", "age"
}

// Les valeurs
for (const value of Object.values(user)) {
    console.log(value) // "Alice", 30
}

// Les entrées (paires [key, value])
for (const entry of Object.entries(user)) {
    console.log(entry) // ["nom", "Alice"], ["age", 30]
}

// Avec le destructuring, on obtient directement key et value
for (const [key, value] of Object.entries(user)) {
    console.log(key, value) // "nom Alice", "age 30"
}
```
