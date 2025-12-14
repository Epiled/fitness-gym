// Exporta cada layer que começa com "icon-" como um SVG separado
// Pensado para Illustrator 2020 e template 1024x1024

function exportIconLayers() {
  if (app.documents.length === 0) {
    alert("Nenhum documento aberto.");
    return;
  }

  var doc = app.activeDocument;

  // Escolher pasta de saída
  var outFolder = Folder.selectDialog("Escolha a pasta para salvar os ícones (SVG):");
  if (!outFolder) {
    return; // usuário cancelou
  }

  // Pega o tamanho do artboard 0 (assumindo que seu icons.ai está 1024x1024)
  var ab = doc.artboards[0].artboardRect;
  var abWidth  = ab[2] - ab[0]; // right - left
  var abHeight = ab[1] - ab[3]; // top - bottom

  // Percorre todas as layers do documento
  for (var i = 0; i < doc.layers.length; i++) {
    var layer = doc.layers[i];

    // Ignora layers invisíveis
    if (!layer.visible) continue;

    // Só layers cujo nome começa com "icon-"
    if (layer.name.indexOf("icon-") !== 0) continue;

    // Se a layer não tiver nenhum objeto, pula
    if (layer.pageItems.length === 0) continue;

    // Cria um novo documento temporário com o mesmo tamanho do artboard
    var tempDoc = app.documents.add(
      doc.documentColorSpace,
      abWidth,
      abHeight
    );

    // Duplicar todo o conteúdo da layer original para a layer padrão do novo doc
    var targetLayer = tempDoc.layers[0];

    for (var p = 0; p < layer.pageItems.length; p++) {
      // PLACEATBEGINNING garante que os itens fiquem na frente
      layer.pageItems[p].duplicate(targetLayer, ElementPlacement.PLACEATBEGINNING);
    }

    // Opcional: selecionar tudo no doc temporário (não é obrigatório para exportar)
    tempDoc.selection = null;
    targetLayer.hasSelectedArtwork = true;

    // Monta o arquivo de saída
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

  alert("Exportação concluída! As layers 'icon-' foram salvas como SVG.");
}

exportIconLayers();
