# Paroles

## Structure de base

Pour associer des paroles à une mélodie, chaque `<note>` reçoit un élément `<verse>`
(le couplet, numéroté avec `@n`), qui contient lui-même un élément `<syl>` portant
le texte de la syllabe chantée sur cette note.

```xml
<note pname="c" oct="4" dur="4">
    <verse n="1"> <!-- [!code highlight] -->
        <syl>Do</syl> <!-- [!code highlight] -->
    </verse> <!-- [!code highlight] -->
</note>
<note pname="d" oct="4" dur="4">
    <verse n="1"> <!-- [!code highlight] -->
        <syl>Ré</syl> <!-- [!code highlight] -->
    </verse> <!-- [!code highlight] -->
</note>
<note pname="e" oct="4" dur="4">
    <verse n="1"> <!-- [!code highlight] -->
        <syl>Mi</syl> <!-- [!code highlight] -->
    </verse> <!-- [!code highlight] -->
</note>
```

<ClientOnly>
  <MeiViewer :meiContent="lyric1" />
</ClientOnly>

## Liaison des syllabes

Une syllabe peut être répartie sur plusieurs notes. Plutôt que d'insérer un tiret directement dans le texte, MEI
propose deux attributs dédiés sur `<syl>` :

- **`@wordpos`** : la position de la syllabe dans le mot (`i` initial, `m` médian,
  `t` terminal)

- **`@con`** : le type de connecteur à afficher entre les syllabes (`d` pour un tiret)

```xml
<note pname="a" oct="4" dur="4">
    <verse n="1">
        <syl wordpos="i" con="d">Chan</syl> <!-- [!code highlight] -->
    </verse>
</note>
<note pname="a" oct="4" dur="4">
    <verse n="1">
        <syl wordpos="t">tons</syl> <!-- [!code highlight] -->
    </verse>
</note>
```

<ClientOnly>
  <MeiViewer :meiContent="tiret" />
</ClientOnly>

## Élision

Une élision se produit lorsque la dernière syllabe d'un mot et la première syllabe du mot suivant sont chantées sur une même note. En MEI, elle est indiquée avec l'attribut `@con` sur la première syllabe.

```xml
<note pname="g" oct="4" dur="4">
    <verse n="1">
        <syl con="b">A</syl> <!-- [!code highlight] -->
    </verse>
</note>
```

<ClientOnly>
  <MeiViewer :meiContent="elision" />
</ClientOnly>

## Mélisme

Un mélisme se produit lorsqu'une seule syllabe est chantée sur plusieurs notes. Ce regroupement se matérialise visuellement par une liaison de phrasé : l'élément `<slur>` ancré aux notes concernées via `@startid` et `@endid`.

```xml
<measure n="1">
    <staff n="1">
        <layer>
            <note xml:id="n1" pname="c" oct="4" dur="8">
                <verse n="1">
                    <syl>A</syl>
                </verse>
            </note>
            <note xml:id="n2" pname="d" oct="4" dur="8" />
            <note xml:id="n3" pname="e" oct="4" dur="4" />
        </layer>
    </staff>
    <slur startid="#n1" endid="#n3" /> <!-- [!code highlight] -->
</measure>
```

<ClientOnly>
  <MeiViewer :meiContent="melisme" />
</ClientOnly>

Par défaut, Verovio calcule automatiquement la direction et la courbure de la liaison. Il est toutefois possible de les contrôler manuellement :

- `@curvedir` force l'orientation générale de la courbe (`above` ou `below`) ;
- `@bulge` ajuste sa forme via une ou plusieurs paires de valeurs [déviation position] : la déviation est exprimée en unités virtuelles (correspondant à la moitié de l'espacement entre deux lignes de la portée) par rapport à la ligne droite reliant le début et la fin de la liaison, et la position est exprimée en pourcentage de la longueur totale de la liaison (0 à 100).

```xml
<slur startid="#n1" endid="#n2" curvedir="below"/>
<slur startid="#n3" endid="#n4" bulge="2 50"/> <!-- dévie de 2 unités virtuelles au milieu de la liaison -->
```

## Liaison de prolongation

Contrairement au `<slur>`, qui exprime une liaison de phrasé entre des notes éventuellement différentes, une liaison de prolongation (`<tie>`) relie deux notes de même hauteur.

Elle peut être encodée de deux manières directement avec l'attribut `@tie` sur les notes :

- `i` (_initial_) indique le début de la liaison ;
- `m` (_medial_) indique une note située au milieu d'une chaîne de liaisons ;
- `t` (_terminal_) indique la fin de la liaison.

```xml
<measure n="1">
    <staff n="1">
        <layer n="1">
            <note dur="4" oct="4" pname="c" tie="i"/> <!-- [!code highlight] -->
            <note dur="4" oct="4" pname="c" tie="t"/> <!-- [!code highlight] -->
            <note dur="4" oct="4" pname="d"/>
            <note dur="4" oct="4" pname="e"/>
        </layer>
    </staff>
</measure>
```

Une autre possibilité consiste à déclarer explicitement la liaison à l'aide de l'élément `<tie>`. Les deux notes sont alors identifiées avec `xml:id`, puis reliées grâce aux attributs `@startid` et `@endid`.

```xml
<measure n="2">
    <staff n="1">
        <layer n="1">
            <note xml:id="n2a" dur="4" oct="4" pname="c"/>
            <note xml:id="n2b" dur="4" oct="4" pname="c"/>
            <note dur="4" oct="4" pname="d"/>
            <note dur="4" oct="4" pname="e"/>
        </layer>
    </staff>
    <tie startid="#n2a" endid="#n2b"/> <!-- [!code highlight] -->
</measure>
```

<script setup>
import lyric1 from './scores/lyric1.mei?raw'
import tiret from './scores/tiret.mei?raw'
import melisme from './scores/melisme.mei?raw'
import elision from './scores/elision.mei?raw'
</script>
