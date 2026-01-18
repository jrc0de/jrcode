let text = ""
let annotations = {}
let musicBlocks = []
let selectedIndices = new Set()
let lastSelectedIndex = null

const textInput = document.getElementById("textInput")
const selectionArea = document.getElementById("selectionArea")
const preview = document.getElementById("preview")
const musicDialog = document.getElementById("musicDialog")
const abcInput = document.getElementById("abcInput")

function parseText() {
    text = textInput.value
    annotations = {}
    musicBlocks = []
    selectedIndices.clear()
    lastSelectedIndex = null
    renderSelectionArea()
    updatePreview()
}

function renderSelectionArea() {
    selectionArea.innerHTML = ""

    const annotatedIndices = new Set()
    for (const key in annotations) {
        annotations[key].indices.forEach((idx) => annotatedIndices.add(idx))
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i]

        if (char === "\n") {
            selectionArea.appendChild(document.createElement("br"))
            continue
        }

        const span = document.createElement("span")

        if (char === " ") {
            span.className = "whitespace"
            span.textContent = " "
            selectionArea.appendChild(span)
            continue
        }

        span.className = "char"
        span.textContent = char
        span.dataset.index = i

        if (selectedIndices.has(i)) {
            span.classList.add("selected")
        }

        if (annotatedIndices.has(i)) {
            span.classList.add("annotated")
        }

        span.onclick = (e) => handleCharClick(i, e)

        selectionArea.appendChild(span)
    }
}

function handleCharClick(index, event) {
    if (selectedIndices.has(index)) {
        selectedIndices.delete(index)
    } else {
        selectedIndices.add(index)
    }

    lastSelectedIndex = index
    renderSelectionArea()
}

function applyStyle(style) {
    if (selectedIndices.size === 0) {
        alert("⚠️ Veuillez d'abord sélectionner au moins une lettre !")
        return
    }

    const groups = []
    const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b)

    let currentGroup = [sortedIndices[0]]
    for (let i = 1; i < sortedIndices.length; i++) {
        if (sortedIndices[i] === sortedIndices[i - 1] + 1 || (sortedIndices[i] === sortedIndices[i - 1] + 2 && text[sortedIndices[i - 1] + 1] === " ")) {
            currentGroup.push(sortedIndices[i])
        } else {
            groups.push(currentGroup)
            currentGroup = [sortedIndices[i]]
        }
    }
    groups.push(currentGroup)

    groups.forEach((group) => {
        const groupKey = group.join(",")
        annotations[groupKey] = {
            indices: group,
            style: style,
        }
    })

    selectedIndices.clear()
    lastSelectedIndex = null
    renderSelectionArea()
    updatePreview()
}

function removeStyle() {
    if (selectedIndices.size === 0) {
        alert("⚠️ Veuillez d'abord sélectionner au moins une lettre !")
        return
    }

    const keysToDelete = []
    for (const key in annotations) {
        const annotation = annotations[key]
        const hasOverlap = annotation.indices.some((idx) => selectedIndices.has(idx))
        if (hasOverlap) {
            keysToDelete.push(key)
        }
    }

    keysToDelete.forEach((key) => delete annotations[key])

    selectedIndices.clear()
    lastSelectedIndex = null
    renderSelectionArea()
    updatePreview()
}

function clearAll() {
    if (confirm("Voulez-vous vraiment effacer toutes les annotations ?")) {
        annotations = {}
        musicBlocks = []
        selectedIndices.clear()
        lastSelectedIndex = null
        renderSelectionArea()
        updatePreview()
    }
}

function openMusicDialog() {
    musicDialog.showModal()
}

function closeMusicDialog() {
    musicDialog.close()
    abcInput.value = ""
}

function insertMusic() {
    const abc = abcInput.value.trim()
    if (!abc) {
        alert("⚠️ Veuillez saisir une notation ABC !")
        return
    }

    const id = "music_" + Date.now()
    musicBlocks.push({ id, abc })

    const marker = `\n[MUSIC:${id}]\n`
    const cursorPos = textInput.selectionStart
    const newText = text.slice(0, cursorPos) + marker + text.slice(cursorPos)

    text = newText
    textInput.value = newText

    closeMusicDialog()
    renderSelectionArea()
    updatePreview()
}

function updatePreview() {
    let html = ""
    const annotationsByStart = {}

    for (const key in annotations) {
        const annotation = annotations[key]
        const startIndex = annotation.indices[0]
        annotationsByStart[startIndex] = annotation
    }

    let i = 0
    while (i < text.length) {
        if (text[i] === "\n") {
            html += "<br>"
            i++
        } else if (text.substr(i, 7) === "[MUSIC:") {
            const endPos = text.indexOf("]", i)
            if (endPos !== -1) {
                const marker = text.substring(i + 1, endPos)
                const id = marker.replace("MUSIC:", "")
                const block = musicBlocks.find((b) => b.id === id)

                if (block) {
                    html += `<div class="music-block">
                        <div class="music-block-preview" id="${id}"></div>
                    </div>`
                }

                i = endPos + 1
                continue
            }
            i++
        } else if (annotationsByStart[i]) {
            const annotation = annotationsByStart[i]
            const textContent = annotation.indices.map((idx) => text[idx]).join("")
            html += `<ruby class="${annotation.style}">${escapeHtml(textContent)}<rt>x</rt></ruby>`
            i = annotation.indices[annotation.indices.length - 1] + 1
        } else {
            html += escapeHtml(text[i])
            i++
        }
    }

    preview.innerHTML = html

    setTimeout(() => {
        musicBlocks.forEach((block) => {
            const el = document.getElementById(block.id)
            if (el && !el.hasChildNodes()) {
                try {
                    ABCJS.renderAbc(block.id, block.abc, {
                        responsive: "resize",
                        staffwidth: 650,
                    })
                } catch (e) {
                    el.innerHTML = '<p style="color: red;">Erreur de notation ABC</p>'
                }
            }
        })
    }, 0)
}

function escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
}

function downloadHTML() {
    let bodyContent = preview.innerHTML

    musicBlocks.forEach((block) => {
        const tempDiv = document.createElement("div")
        const tempId = "export_" + block.id
        document.body.appendChild(tempDiv)
        tempDiv.id = tempId

        try {
            ABCJS.renderAbc(tempId, block.abc, {
                responsive: "resize",
                staffwidth: 700,
            })

            const svgContent = tempDiv.innerHTML
            bodyContent = bodyContent.replace(`<div class="music-block-preview" id="${block.id}"></div>`, `<div class="music-block-preview">${svgContent}</div>`)
        } catch (e) {
            console.error("Erreur export:", e)
        }

        document.body.removeChild(tempDiv)
    })

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Texte annoté avec partitions</title>
<style>
  body {
    font-size: 24px;
    line-height: 2.5;
    padding: 40px;
    font-family: 'Courier New', 'Consolas', monospace;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  ruby {
      position: relative;
      display: inline-block;
  }

  rt {
      visibility: hidden;
      font-size: 0;
  }

  ruby.median::before {
      content: '';
      position: absolute;
      top: 0.4em;
      width: 0.7em;
      left: 0;
      right: 0;
      height: 2px;
      background: currentColor;
  }

  ruby.median-haut::before {
      content: '';
      position: absolute;
      top: -0.05em;
      width: 0.7em;
      left: 0;
      right: 0;
      height: 2px;
      background: currentColor;
  }

  ruby.flexe::before {
      content: '';
      position: absolute;
      top: -0.05em;
      left: 50%;
      width: 2px;
      height: 0.5em;
      background: currentColor;
      transform: translateX(-50%);
  }

  ruby.flexe::after {
      content: '';
      position: absolute;
      top: 0.15em;
      left: 50%;
      width: 0.5em;
      height: 2px;
      background: currentColor;
      transform: translateX(-50%);
  }

  ruby.montant::before {
      content: '';
      position: absolute;
      top: 0.20em;
      width: 0.7em;
      height: 2px;
      background: currentColor;
      transform-origin: center center;
      transform: translateX(-55%);
      transform: rotate(-45deg);
  }

  ruby.descendant::before {
      content: '';
      position: absolute;
      top: 0.20em;
      width: 0.7em;
      height: 2px;
      background: currentColor;
      transform-origin: center center;
      transform: translateX(-50%);
      transform: rotate(45deg);
  }

  .music-block {
      background: #f8f9fa;
      border: 2px solid #0066cc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
  }

  .music-block-preview {
      background: white;
      padding: 20px;
      border-radius: 4px;
      margin-top: 10px;
  }

  .music-block strong {
      display: block;
      margin-bottom: 10px;
      color: #0066cc;
  }
</style>
</head>
<body>
${bodyContent}
</body>
</html>`

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "texte-annote-avec-partitions.html"
    a.click()
    URL.revokeObjectURL(url)
}

textInput.addEventListener("input", () => {
    text = textInput.value
    renderSelectionArea()
    updatePreview()
})

parseText()
