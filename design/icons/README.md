# 📘 Icons Creation & Export — Documentation

This guide explains how to use the icons.ai template, how to organize your files, and how to generate icon exports using Illustrator scripts.

> **Compatible with Adobe Illustrator 2020 or newer.**

---

## 📁 Files and Folder Structure

**1. icons.ai**

This is the main working template for the project.
It is already configured with:

Artboard size: **1024 × 1024 px**
Drawing area: **1024 × 1024 px**  
Outer 200 px reserved as a **safety margin (not used in this project)**
Contains all current project icons.
All icons must follow the **layer naming rules** described below.
Each icon must exist in **its own layer**

---

**2. Templates Folder**

Contains the Illustrator template:

- **Icon-Font-Grid-Template-1024.ait**

This template can be loaded into Illustrator as a standard “New Document Template.”

---

**3. Scripts Folder**

Contains the scripts used to export icons:

**exportIcons.jsx** – lets the user select an output folder

**exportIconsAuto.jsx** – exports automatically to a predefined folder (`./dist/icons/` inside the icons.ai directory)

These scripts automate the creation of SVG files used to generate the icon font.

---

**4. Logos Folder**

Contains company logos and mono-color variations that can be used inside the **icons.ai** document.

---

**5. Icons UI Folder**

Contains all icons that **will** be converted into the font-icon file (monochrome icons).
Icons UI Folder

---

**6. Icons Art Folder**

Contains icons that **will NOT** become part of the icon font
(e.g., multicolor illustrations, decorative icons, artwork).

---

## How to Use icons.ai

To keep consistency when generating the icon font, follow these rules.

---

### 📌 Layer Structure Rules (IMPORTANT)

**1. Each icon must be inside its own layer**

- Never group multiple icons inside the same layer
- Do NOT use sublayers unless necessary
- The script exports icons by reading the top-level layers

**2. Naming Convention**

Every icon layer must follow the format:

```
icon-<name>
```

**Examples:**

- icon-home
- icon-user
- icon-chat
- icon-heart
- icon-lock

This naming is required for:

- Automated exports
- Consistent font-icon naming
- Avoiding naming collisions

**3. Use the 824x824 draw area**

Icons must stay inside the inner square (no elements touching or crossing the 200px safety margins).

**4. Strokes, fills and weights**

- Use 1 color only (monochrome)
- Convert strokes to outlines only if necessary
- Avoid masks or clipping unless absolutely needed
- Do not use raster images

---

## 🎨 How to Use the Template

### Option 1 — Open directly (simple mode)

**1.** Open Adobe Illustrator
**2.** Go to **File → Open**
**3.** Select **Icon-Font-Grid-Template-1024.ait**

Illustrator will create a **new document based on the template**, keeping the original intact.

---

### Option 2 — Install as an Illustrator Template

If you want the template to appear in **File → New**, install it into Illustrator’s template directory.

**1.** Copy **Icon-Font-Grid-Template-1024.ait**

**2.** Paste it into Illustrator’s template folder:

Windows:

```
C:\Program Files\Adobe\Adobe Illustrator <version>\Support Files\Required\NewDocumentProfiles\
```

Mac:

```
/Applications/Adobe Illustrator <version>/Presets/<language>/New Document Profiles/
```

After this:

- Open Illustrator → **File → New**
- The template will appear in the list.

---

## ⚙️ How to Run the Export Scripts (Step-by-step)

There are two scripts in the **Scripts** folder.

---

**1. exportIcons.jsx**

- Asks the user to choose an output directory
- Exports all icons inside **icons.ai**
- Useful when exporting manually or for testing

**Use when:**
You need to export icons to a custom folder.

---

**2. exportIconsAuto.jsx**

- Automatically exports icons to:

```
./dist/icons/
```

- No dialog appears
- Best option for automated pipelines

**Use when:**
You want fast, consistent, repeatable exports with no user input.

---

### Option A — Run script once (quick method)

**1.** Open **icons.ai**
**2.** Go to **File → Scripts → Other Script…**
**3.** Select one of:

- `exportIcons.jsx`
- `exportIconsAuto.jsx`

**4.** Illustrator will run the script:

- exportIcons → asks for folder
- exportIconsAuto → exports instantly to `./dist/icons/`

---

### Option B — Install scripts permanently

So they appear directly inside **File → Scripts**.

**1.** Copy the `.jsx` files
**2.** Paste them in the Illustrator scripts folder:

**Windows**

```
C:\Program Files\Adobe\Adobe Illustrator <version>\Presets\en_US\Scripts\
```

**Mac**

```
/Applications/Adobe Illustrator <version>/Presets/<language>/Scripts/
```

**3.** Restart Illustrator

Now the scripts will appear in:

**File → Scripts → exportIcons**
**File → Scripts → exportIconsAuto**

---

**🚀 Workflow Summary**

**1.** Open **icons.ai**
**2.** Each icon = 1 layer named `icon-*`
**3.** Draw inside the 824×824 area:
**4.** Run script:

- **exportIcons.jsx** → pick a folder
- **exportIconsAuto.jsx** → exports to `./dist/icons/` automatically

**5.** Your exported SVGs are ready for the icon font builder

---
