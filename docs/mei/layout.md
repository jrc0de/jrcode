# Mise en page

## Saut de système

L'élément `<sb>` (_system break_) force le début d'un nouveau système.

```xml
<section>
    <measure n="1">
        <!-- contenu de la mesure -->
    </measure>
    <sb/> <!-- [!code highlight] -->
    <measure n="2">
        <!-- contenu de la mesure -->
    </measure>
</section>
```

## Saut de page

L'élément `<pb>` (_page break_) force le début d'une nouvelle page.

```xml
<section>
    <measure n="1">
        <!-- contenu de la mesure -->
    </measure>
    <pb/> <!-- [!code highlight] -->
    <measure n="2">
        <!-- contenu de la mesure -->
    </measure>
</section>
```
