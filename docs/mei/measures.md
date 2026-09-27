# Mesures et barres de mesure

## Structure de base

Chaque mesure est représentée par l'élément `<measure>` qui est un sous-élément de `<section>`. Ses attributs `@right` et `@left` définissent le type de barre affichée respectivement après et avant la mesure. L'attribut `@n` est optionnel, mais recommandé.

```xml
<section>
    <measure n="1">
        ...
    </measure>
    <measure n="2" right="dbl">
        ...
    </measure>
    <measure n="3" right="end">
        ...
    </measure>
</section>
```

<ClientOnly>
  <MeiViewer :meiContent="measures_1" />
</ClientOnly>

## Attributs de mesure

| Attribut | Description                      | Valeurs possibles                                                                                                                                       |
| -------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@n`     | Numéro de la mesure              | entier (`1`, `2`...)                                                                                                                                    |
| `@right` | Type de barre en fin de mesure   | `dbl` (double), `end` (finale), `rptstart` (début de reprise), `rptend` (fin de reprise), `dashed` (tirets), `dotted` (pointillés), `invis` (invisible) |
| `@left`  | Type de barre en début de mesure | même valeurs que pour `@right`                                                                                                                          |

<script setup>
import measures_1 from './scores/measures_1.mei?raw'
</script>

## Sous-élément de portée

L'élément `<staff>` représente une portée physique. Son attribut `@n` est obligatoire et doit correspondre au `@n` du `<staffDef>` défini dans le `<scoreDef>`. C'est cette correspondance qui permet de savoir quelle clé, quelle armure, etc. appliquer à cette portée.

```xml
<measure n="1">
    <staff n="1"> <!-- [!code highlight] -->
            ... <!-- [!code highlight] -->
    </staff> <!-- [!code highlight] -->
</measure>
```

## Sous-élément de couche

Chaque élément `<staff>` peut contenir un ou plusieurs `<layer>`, servant à représenter plusieurs « voix » simultanées sur une même portée (polyphonie). Comme pour `<staff>`, l'attribut `@n` identifie la couche et permet de la relier à un éventuel `<layerDef>`.

C'est toujours la couche `<layer>`, et elle seule, qui reçoit directement les notes et porte le contenu musical proprement dit.

```xml
<measure n="1">
    <staff n="1">
        <layer n="1"> <!-- [!code highlight] -->
            ... <!-- [!code highlight] -->
        </layer> <!-- [!code highlight] -->
    </staff>
</measure>
```
