# Classes

## Déclaration de base

Une classe définit un modèle pour créer des objets. On type ses propriétés directement dans le corps de la classe.

```ts
class User {
    name: string
    age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
}
```
