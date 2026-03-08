// Exporta cada layer que começa com "icon-" como um SVG separado
// Cria pasta "dist" automaticamente ao lado do arquivo .ai

function exportIconLayers() {
  if (app.documents.length === 0) {
    alert("Nenhum documento aberto.");
    return;
  }

  var doc = app.activeDocument;

  // PASTA DO ARQUIVO ATUAL (.ai)
  var baseFolder = doc.path;

  // Criar subpasta "dist"
  var outFolder = new Folder(baseFolder + "/dist");
  if (!outFolder.exists) {
    outFolder.create();
  }

  // Tamanho do artboard 0
  var ab = doc.artboards[0].artboardRect;
  var abWidth  = ab[2] - ab[0];
  var abHeight = ab[1] - ab[3];

  // Percorre as layers
  for (var i = 0; i < doc.layers.length; i++) {
    var layer = doc.layers[i];

    // Ignora layers invisíveis
    if (!layer.visible) continue;

    // Só layers cujo nome começa com "icon-"
    if (layer.name.indexOf("icon-") !== 0) continue;

    // Se a layer não tiver nenhum objeto, pula
    if (layer.pageItems.length === 0) continue;

    // Novo documento temporário
    var tempDoc = app.documents.add(
      doc.documentColorSpace,
      abWidth,
      abHeight
    );

    var targetLayer = tempDoc.layers[0];

    // Copiar todos os itens da layer
    for (var p = 0; p < layer.pageItems.length; p++) {
      // PLACEATBEGINNING garante que os itens fiquem na frente
      layer.pageItems[p].duplicate(targetLayer, ElementPlacement.PLACEATBEGINNING);
    }

    // Criar arquivo SVG
    var file = new File(outFolder.fsName + "/" + layer.name + ".svg");

    // Opções de exportação SVG
    var exportOptions = new ExportOptionsSVG();
    exportOptions.embedRasterImages = true;
    exportOptions.fontSubsetting = SVGFontSubsetting.None;
    exportOptions.documentEncoding = SVGDocumentEncoding.UTF8;

    // Exporta SVG
    tempDoc.exportFile(file, ExportType.SVG, exportOptions);

    // Fecha o documento temporário sem salvar
    tempDoc.close(SaveOptions.DONOTSAVECHANGES);
  }

  alert("Exportação concluída! SVGs salvos em: " + outFolder.fsName);
}

exportIconLayers();
