# Esta plantilla esta realizada en Google Apps Script basado en Java


function afterFormSubmit(e) {
  
  const info = e.namedValues; # Rutina con Google Forms
  const pdfFile = createPDF(info);
  const entryRow = e.range.getRow(); # Rutina con Google Forms
  const ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Hoja de Sheets");
  ws.getRange(entryRow, 12).setValue(pdfFile.getUrl());
  ws.getRange(entryRow, 13).setValue(pdfFile.getName());
  
  sendEmail('email','Archivo a adjuntar');
    
}

function sendEmail(email,pdfFile){
  
  GmailApp.sendEmail(email, "Mensaje", {
    attachments: [pdfFile], 
    name: 'Asunto'
  
  })
  
}  
  
  
function createPDF(info){
    
   
    const pdfFolder = DriveApp.getFolderById("FolderID");
    const tempFolder = DriveApp.getFolderById("FolderID");
    const templateDoc = DriveApp.getFileById("Template");
    
    const newTempFile = templateDoc.makeCopy(tempFolder);
    
    const openDoc = DocumentApp.openById(newTempFile.getId());
    
    const body = openDoc.getBody();
    body.replaceText("{A remplazar en el Template}", info['ColumnName'][0]);
    openDoc.saveAndClose();
    
    
    const blobPDF = newTempFile.getAs(MimeType.PDF);
    const pdfFlie = pdfFolder.createFile(blobPDF).setName(info['ID'][0]);
    tempFolder.removeFile(newTempFile);
  
    return pdfFlie;

}
