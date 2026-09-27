# Portées et clés

## Définition des portées

La définition des portées se fait dans l'élément `<scoreDef>` que nous avons vu en introduction.

- L'élément `<staffGrp>` regroupe les portées d'une partition (par exemple les deux portées d'un piano, ou l'ensemble des pupitres d'un orchestre).

- L'élément `<staffDef>` définit une portée individuelle : son numéro, son nombre de lignes et sa clé. C'est l'attribut `@n` qui permet de faire le lien entre une portée et le contenu musical qui lui correspond (via l'attribut `@staff` sur les éléments comme `<layer>` ou `<note>` comme nous verrons par la suite).

```xml
<scoreDef>
    <staffGrp symbol="brace" bar.thru="true">
        <staffDef n="1" lines="5" clef.shape="G" clef.line="2" key.sig="1s" />
        <staffDef n="2" lines="5" clef.shape="F" clef.line="4" />
    </staffGrp>
</scoreDef>
```

<ClientOnly>
  <MeiViewer :meiContent="staves_1" />
</ClientOnly>

## Attributs de `<staffGrp>`

| Attribut    | Description                                                                             | Valeurs possibles                                                                                           |
| ----------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@symbol`   | Symbole visuel reliant les portées du groupe                                            | `brace` (accolade), `bracket` (crochet arrondi), `bracketsq` (crochet droit), `line` (simple trait), `none` |
| `@bar.thru` | Indique si les barres de mesure traversent tout le groupe ou s'arrêtent à chaque portée | `true` (barres continues), `false` (barres indépendantes par portée)                                        |

## Attributs de `<staffDef>`

| Attribut      | Description                        | Valeurs possibles                                         |
| ------------- | ---------------------------------- | --------------------------------------------------------- |
| `@n`          | Numéro de la portée                | entier (`1`, `2`...), utilisé pour référencer la portée   |
| `@lines`      | Nombre de lignes de la portée      | `5` par défaut, `1` pour une portée rythmique par exemple |
| `@clef.shape` | Forme de la clé                    | `G` (clé de sol), `F` (clé de fa), `C` (clé d'ut)         |
| `@clef.line`  | Ligne sur laquelle se place la clé | `1` à `5`, selon la position de référence de la clé       |

## Définition des armures

L'armure se définit à l'aide de l'élément `<keySig>`, placé en enfant de `<staffDef>`, avec un ou plusieurs `<keyAccid>` pour chaque altération.

```xml
<scoreDef>
    <staffGrp symbol="brace" bar.thru="true">
        <staffDef n="1" lines="5" clef.shape="G" clef.line="2">
            <keySig> <!-- [!code highlight] -->
                <keyAccid pname="b" accid="f" /> <!-- [!code highlight] -->
            </keySig> <!-- [!code highlight] -->
        </staffDef>
        <staffDef n="2" lines="5" clef.shape="F" clef.line="4">
            <keySig> <!-- [!code highlight] -->
                <keyAccid pname="b" accid="f" /> <!-- [!code highlight] -->
            </keySig> <!-- [!code highlight] -->
        </staffDef>
    </staffGrp>
</scoreDef>
```

<ClientOnly>
  <MeiViewer :meiContent="staves_3" />
</ClientOnly>

## Attributs de `<keyAccid>`

| Attribut | Description                     | Valeurs possibles                                                                 |
| -------- | ------------------------------- | --------------------------------------------------------------------------------- |
| `@pname` | Note concernée par l'altération | `c` (do), `d` (ré), `e` (mi), `f` (fa), `g` (sol), `a` (la), `b` (si), `b`        |
| `@accid` | Type d'altération               | `s` (dièse), `f` (bémol), `ss` (double dièse), `ff` (double bémol), `n` (bécarre) |

## Nom des portées

Le nom d'une portée passe par le sous-élément `<label>`. Il s'affiche à gauche de la portée, sur le premier système de la partition. Pour les systèmes suivants, on peut fournir une version abrégée avec `<labelAbbr>`. Il est alors affiché `<label>` sur le premier système et `<labelAbbr>` sur les suivants.

```xml
<scoreDef>
    <staffGrp symbol="bracket" bar.thru="true">
        <staffDef n="1" lines="5" clef.shape="G" clef.line="2">
            <label>Soprano</label> <!-- [!code highlight] -->
            <labelAbbr>S.</labelAbbr> <!-- [!code highlight] -->
        </staffDef>
        <staffDef n="2" lines="5" clef.shape="G" clef.line="2">
            <label>Ténor</label> <!-- [!code highlight] -->
            <labelAbbr>T.</labelAbbr> <!-- [!code highlight] -->
        </staffDef>
        <staffDef n="3" lines="5" clef.shape="F" clef.line="4">
            <label>Basse</label> <!-- [!code highlight] -->
            <labelAbbr>B.</labelAbbr> <!-- [!code highlight] -->
        </staffDef>
    </staffGrp>
</scoreDef>
```

<ClientOnly>
  <MeiViewer :meiContent="staves_2" />
</ClientOnly>

<script setup>
import staves_1 from './scores/staves_1.mei?raw'
import staves_2 from './scores/staves_2.mei?raw'
import staves_3 from './scores/staves_3.mei?raw'
</script>
