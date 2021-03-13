////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Cotation
>=-----------------------------------------------------------------------------------------------------------------------------
Author: Christian Condamine - condaminech@noos.fr
>=-----------------------------------------------------------------------------------------------------------------------------
This script allows you to add:
    - a horizontal and / or vertical dimension to the selection of an objet or a group of objects.
    - or an aligned dimension to the direct selection of segment
         It allows to choose also (in particular via a real-time preview):
             - the scale
             - the position of the dimension (above, below, etc.)
             - the position of the reference of the quotation value for small objects
             - the symbol used
             - the color of the quotation
             - the length of the attachment lines
             - the unit
             - the size of the dimensions and all its components (value, symbol, attachment
               lines, dimension lines).
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
The management of the preview and the saving of the data were inspired by scripts of
Alexander Ladygin - www.ladygin.pro
*/
var nomScript = 'Cotation',
    fichierParam = {
        name: nomScript + '_param.json',
        folder: Folder.myDocuments + '/CC_Scripts/'
    }
// Variables declaration for the active document
    var monFichier = app.activeDocument;
    var maSelection = monFichier.selection
// Loop to determine if something is selected or not
    var nbItemsSelectionnes = app.activeDocument.selection.length;
    if (nbItemsSelectionnes != 0) {
        // Create a variable for a linear dimension
           monType = "LIN"
        // Loop to determine if the selection is a segment
        if (monFichier.selection[0].typename === "PathItem"){
            if (monFichier.selection[0].selectedPathPoints.length===2) {
                maSelection = monFichier.selection[0].selectedPathPoints
                                // Création de variables pour les données de cotation (en points)
                                var p1_x = maSelection[0].anchor[0]
                                var p1_y = maSelection[0].anchor[1]
                                var p2_x = maSelection[1].anchor[0]
                                var p2_y = maSelection[1].anchor[1]
                                var cote1 = p2_x - p1_x;
                                var cote2 = p2_y - p1_y;
                                // Change the value of the variable if it is an aligned dimension
                                monType = "ALIG"
             };
         };
         /////// Call the function for creating the "Cotation" layer
              creation_cCalque();
              defaire = false;
              ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              //    Dialog box  LIN ou ALIG    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    var boiteDialogueCotation = new Window ('dialog', "Cotation");
                    boiteDialogueCotation.alignChildren = "left";
                    boiteDialogueCotation.spacing = 5;
             /////// Scale
                    var grpEchelle = boiteDialogueCotation.add('group');
                           var lblEch = grpEchelle.add("statictext",undefined,"Scale in %");
                           txtEch = grpEchelle.add("edittext", [0,0,35,24],10);
                           txtEch.characters = 3;
                           grpEchelle.orientation = "row";
                           txtEch.helpTip = 'At what scale has the object to be dimensioned been drawn ?';
                           txtEch.onChange = function() {majApercu();};
             /////// Limits (LIN)
                    if(monType === "LIN"){
                           var panPLimites = grpEchelle.add('panel', [0,0,328,45], "Bounds",{borderStyle:'white'});
                                    panPLimites.orientation = "row";
                                    var rdVis = panPLimites.add('radiobutton',[10,15,120,30], "With outlines");
                                    rdVis.onClick = function() {majApercu()};
                                    var rdGeo = panPLimites.add('radiobutton',[120,15,260,30], "Without outlines");
                                    rdGeo.onClick = function() {majApercu()};
                     };
             /////// Divider_1
                    var diviseur_1 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_1.alignment = "fill";
             /////// Dimensions (LIN)
                    if(monType === "LIN"){
                            var grpCotes = boiteDialogueCotation.add('group');
                                    var grpPosition = grpCotes.add('group');
                                    var grpRenvoi = grpCotes.add('group');
                                    grpCotes.orientation = "column";
                                    grpCotes.alignChildren = "left";
                     /////// Width Dimension (LIN)
                            var panPositionCoteL = grpPosition.add('panel',[0,0,225,105], "Position Width Dimension",{borderStyle:'white'});
                                    var haut = panPositionCoteL.add('radiobutton',[10,15,88,29], "Above");
                                    var bas = panPositionCoteL.add('radiobutton',[10,43,95,58], "Below");
                                    var nL = panPositionCoteL.add('radiobutton', [10,71,157,86], "No width dimension");
                                    panPositionCoteL.alignChildren = "left";
                                    haut.onClick = function () {majApercu();};
                                    bas.onClick = function () {majApercu();};
                                    nL.onClick = function () {majApercu();};
                     /////// Height Dimension (LIN)
                            var panPositionCoteH = grpPosition.add('panel', [0,0,224,105], "Position Height Dimension",{borderStyle:'white'});
                                    var gauche = panPositionCoteH.add('radiobutton', [10,15,100,29], "To the left");
                                    var droite = panPositionCoteH.add('radiobutton',[10,43,100,58], "To the right");
                                    var nH = panPositionCoteH.add('radiobutton', [10,71,200,86], "No height dimension");
                                    panPositionCoteH.alignChildren = "left";
                                    droite.onClick = function () {majApercu();};
                                    gauche.onClick = function () {majApercu();};
                                    nH.onClick = function () {majApercu();};
                     /////// Width Text Offset (LIN)
                            var panRenvoiCoteL = grpRenvoi.add('panel', [0,0,225,80], "Width text offset");
                                    var rG = panRenvoiCoteL.add('radiobutton', [10,15,200,29], "Offset to the left");
                                    var rD = panRenvoiCoteL.add('radiobutton', [10,43,200,58], "Offset to the right");
                                    rG.helpTip = 'Move the text to the left if it is wider than the object';
                                    rD.helpTip = 'Move the text to the right if it is wider than the object';
                                    panRenvoiCoteL.orientation = "column";
                                    panRenvoiCoteL.alignChildren = "left";
                                    rG.onClick = function () {majApercu();};
                                    rD.onClick = function () {majApercu();};
                     /////// Height Text Offset (LIN)
                           var panRenvoiCoteH = grpRenvoi.add('panel', [0,0,224,80], "Height Text Offset");
                                    var rH = panRenvoiCoteH.add('radiobutton', [10,15,200,29], "Offset to the high");
                                    var rB = panRenvoiCoteH.add('radiobutton', [10,43,200,58], "Offset to the bottom"); 
                                    rH.helpTip = 'Move the text up if it is larger than the object';
                                    rB.helpTip = 'Move the text down if it is larger than the object';
                                    panRenvoiCoteH.orientation = "column";
                                    panRenvoiCoteH.alignChildren = "left";
                                    rH.onClick = function () {majApercu();};
                                    rB.onClick = function () {majApercu();};
                            var mem_rdGeo,mem_rdVis,mem_haut,mem_bas,mem_nH,mem_droite,mem_gauche,
                                   mem_nL,mem_rH,mem_rB;
                     } else {
                     /////// Direction (ALIG)
                            var grpSensRenvoi = boiteDialogueCotation.add('group');
                                   grpSensRenvoi.orientation = "row";
                                   var panSens = grpSensRenvoi.add('panel', [0,0,90,62], "Direction");
                                   var chbInverser = panSens.add("checkbox", [10,15,150,28],"Reverse");
                                   chbInverser.onClick = function() {majApercu();};
                     /////// Text Offset (ALIG)
                           var panRenvoiCote = grpSensRenvoi.add('panel', [0,0,358,62], "Text Offset");
                                    var rD = panRenvoiCote.add('radiobutton', [10,15,150,28], "Move text to Side A");
                                    var rG = panRenvoiCote.add('radiobutton', [160,15,310,28], "Move Text to Side B");
                                    rD.helpTip = 'Move the text to the side A if it is wider than the object';
                                    rG.helpTip = 'Move the text to the side AB if it is wider than the object';
                                    panRenvoiCote.orientation = "row";
                                    rD.onClick = function () {majApercu();};
                                    rG.onClick = function () {majApercu();};
                           var mem_chbInverser;
                     };
             /////// Divider_2
                    var diviseur_2 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_2.alignment = "fill";
             /////// Symbol
                    var grpFormats  = boiteDialogueCotation.add('group')
                            var panSymbole = grpFormats.add ('panel', [0,0,150,60], "Symbol")
                                   panSymbole.orientation = "row";
                                   panSymbole.alignChildren = "left";
                                   var symbFL = panSymbole.add('radiobutton', [10,15,70,30], "Arrow");
                                   var symbSH = panSymbole.add('radiobutton', [85,15,180,30], "Slash");
                                          symbFL.onClick = function() {majApercu(); };
                                          symbSH.onClick = function() {majApercu(); };
              /////// Colours
                            var grpCouleurs = grpFormats.add ('panel', [0,0,105,60], "Colour")
                                    var listeCouleurs = grpCouleurs.add('DropDownList', [10,15,92,34], ["Black", "Magenta", "Cyan","Green", "Yellow","White"]);
                                    listeCouleurs.minimumSize.width = 80;
                                    listeCouleurs.selection = listeCouleurs.selection === null ? 0 : listeCouleurs.selection;
                                    listeCouleurs.onChange = function() {majApercu();};
             /////// User Factor
                            var panFactUtil =grpFormats.add ('panel', [0,0,184,60], "Coef Size of the Dimension")
                                    var txtFactUtil = panFactUtil .add('edittext', [10,15,45,34],75);
                                    txtFactUtil.characters = 4;
                                    txtFactUtil.helpTip = 'Adapt the size of the dimension to the size of the object \050in % of the base size\051';
                                    var lblpourCent= panFactUtil.add('statictext',[54,15,92,34],"%");
                                    txtFactUtil.onChange = function() {majApercu();};
                                    panFactUtil.orientation = "row";
                                   panFactUtil.alignChildren = "top"
             /////// Divider_3
                    var diviseur_3 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_3.alignment = "fill";
             /////// Attachment lines length
                    var grpLigne3=boiteDialogueCotation.add('group')
                            var panLongLigneAtt = grpLigne3.add('panel', [0,0,245,60], "Attachment Lines Length")
                                    var fois1 = panLongLigneAtt.add('radiobutton', [10,15,47,30], "x 1");
                                    fois1.helpTip = 'Choose the 1st of the 5 levels for the attachment lines length';
                                    var fois2 = panLongLigneAtt.add('radiobutton', [52,15,94,30], "x 2");
                                    fois2.helpTip = 'Choose the 2nd of the 5 levels for the attachment lines length';
                                    var fois3 = panLongLigneAtt.add('radiobutton', [99,15,141,30], "x 3");
                                    fois3.helpTip = 'Choose the 3rd of the 5 levels for the attachment lines length';
                                    var fois4 = panLongLigneAtt.add('radiobutton', [146,15,188,30], "x 4");
                                    fois4.helpTip = 'Choose the 4th of the 5 levels for the attachment lines length';
                                    var fois5 = panLongLigneAtt.add('radiobutton', [193,15,235,30], "x 5");
                                    fois5.helpTip = 'Choose the 5th of the 5 levels for the attachment lines length';
                                    panLongLigneAtt.spacing = 5;
                                    panLongLigneAtt.orientation = "row";
                                    fois1.onClick = function() {majApercu()};
                                    fois2.onClick = function() {majApercu()};
                                    fois3.onClick = function() {majApercu()};
                                    fois4.onClick = function() {majApercu()};
                                    fois5.onClick = function() {majApercu()};
             /////// Units
                           var panUnites = grpLigne3.add('panel', [0,0,100,60], "Unit")
                                    var listeUnites = panUnites.add('DropDownList',[10,15,85,34], ["mm", "cm", "inches", "pixels"]);
                                    listeUnites.minimumSize.width = 80;
                                    listeUnites.selection = listeUnites.selection === null ? 0 : listeUnites.selection;
                                    listeUnites.onChange = function() {majApercu();};
             /////// Decimals
                           var panDec = grpLigne3.add('panel', [0,0,95,60], "Decimals")
                                    var nbDec = panDec .add('edittext', [10,15,50,34],0);
                                    nbDec.characters = 4;
                                    nbDec.onChange = function() {majApercu();};
             /////// Divider_4
                    var diviseur_4 = boiteDialogueCotation.add('panel', undefined, undefined);
                            diviseur_4.alignment = "fill";
             /////// Buttons
                    var grpBoutons = boiteDialogueCotation.add("group")
                            var btnOk = grpBoutons.add("button", [330,15,376,50], "Ok");
                            var btnAnnul = grpBoutons.add("button", [386,15,472,50], "Cancel", { name: 'Cancel' });
             /////// "Cancel" button action
                                btnAnnul.onClick =  function() {
                                                                  if (defaire) {app.undo();}
                                                              boiteDialogueCotation.close();
                                                              };
            boiteDialogueCotation.onClose = function() { sauverParametres()};
            verifDossierParam()
            chargerParametres(); 
            boiteDialogueCotation.center();
            majApercu();
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            boiteDialogueCotation.show();
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}else {
        alert("Please select the object or set of objects or the segment to dimension.");
} ;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Update preview    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function majApercu() {
        if (defaire) {
            app.undo();
        }else{
            defaire = true;
        app.redraw();
        };
        monType === "LIN" ? dessinerCotationLIN() : dessinerCotationALIG();
        app.redraw();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Collect initial data   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function recueilDonnees() {
// Échelle
    echelle = txtEch.text
if(monType === "LIN"){
        // Limites
            mesLimites =  rdVis.value  ? "vis" : "geo";
                    var vb0,vb1,vb2,vb3;
                    if(mesLimites==="vis"){
                        vb0=maSelection[0].visibleBounds[0];
                        vb1=maSelection[0].visibleBounds[1];
                        vb2=maSelection[0].visibleBounds[2];
                        vb3=maSelection[0].visibleBounds[3];
                        // Cas selection multiple
                            for (var a=0;a<nbItemsSelectionnes;a++){
                                 vb0  = vb0<maSelection[a].visibleBounds[0] ? vb0 : maSelection[a].visibleBounds[0];
                                 vb1 = vb1>maSelection[a].visibleBounds[1] ? vb1 : maSelection[a].visibleBounds[1];
                                 vb2 = vb2>maSelection[a].visibleBounds[2] ? vb2 : maSelection[a].visibleBounds[2];
                                 vb3 = vb3<maSelection[a].visibleBounds[3] ? vb3 : maSelection[a].visibleBounds[3];
                            };
                    } else {
                        vb0=maSelection[0].geometricBounds[0];
                        vb1=maSelection[0].geometricBounds[1];
                        vb2=maSelection[0].geometricBounds[2];
                        vb3=maSelection[0].geometricBounds[3];
                        // Cas selection multiple
                            for (var a=0;a<nbItemsSelectionnes;a++){
                                 vb0  = vb0<maSelection[a].geometricBounds[0] ? vb0 : maSelection[a].geometricBounds[0];
                                 vb1 = vb1>maSelection[a].geometricBounds[1] ? vb1 : maSelection[a].geometricBounds[1];
                                 vb2 = vb2>maSelection[a].geometricBounds[2] ? vb2 : maSelection[a].geometricBounds[2];
                                 vb3 = vb3<maSelection[a].geometricBounds[3] ? vb3 : maSelection[a].geometricBounds[3];
                            };
                     };
                     /////// Creation of variables for X et Y coordinates of the object (in points)
                            L = new Array(vb0,vb1,vb2,vb3);
                            largeur = (L[2]-L[0]);
                            hauteur = (L[1]-L[3]);
                     /////// Creation of variables for the location of the selection center
                            LCentre = L[0] + ((L[2]-L[0])/2);
                            HCentre = L[1] - ((L[1]-L[3])/2);
} else {
        // Direction (ALIG)
            invSens = chbInverser.value
            x = invSens ? p2_x : p1_x;
            y = invSens ? p2_y : p1_y;
        // Offset (ALIG)
            monRenvoi = rD.value ? "A" : "B";
            maLongueur = Math.sqrt(Math.pow(cote1,2) + Math.pow(cote2,2));
};
 // Symbol
    monSymbole = symbFL.value ? "fleche" : "slash";
// Colour
    maNuance = decoderCouleur(listeCouleurs.selection.text);
// User Coeff.
    factUtil = txtFactUtil.text;
    coefUtil = factUtil/100;
    largSymb = 13*coefUtil;
    hautSymb = monSymbole === "fleche" ? 8*coefUtil : 13*coefUtil;
    esp = 0.75*coefUtil
    epTrait = 0.3 * coefUtil;
// Attachment lines length coeff.
    ligAtt = fois2.value ? 2 : ligAtt = fois3.value  ? 3 : ligAtt = fois4.value ? 4 : ligAtt = fois5.value ? 5 : 1;
    u = fois2.value ? 55*coefUtil : u = fois3.value  ? 80*coefUtil : u = fois4.value ? 105*coefUtil : u = fois5.value ? 130 : 30*coefUtil;
// Units
    dec = nbDec.text;
    choisirUnite(listeUnites.selection.text);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw the linear dimension    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  dessinerCotationLIN() {
        recueilDonnees();
//////////// Width dimension group
            var mesure_L = cCalque.groupItems.add();
            mesure_L.name = "Largeur";
//////////// Height dimension group
            var mesure_H = cCalque.groupItems.add();
            mesure_H.name = "Hauteur";
//////////// Width dimension symbol
            var symbL = new Array();
                for (var c=0; c<2;c++){
                    symbL[c] = mesure_L.pathItems.add();
                    symbL[c].name = "symbL" + c
                    if (monSymbole === "fleche"){
                        DessinerFleche(symbL[c])
                    }else{
                        DessinerSlash(symbL[c]);
                    };
                };
//////////// Height dimension symbol
             var symbH = new Array();
                for (c=0; c<2;c++){
                    symbH[c] = mesure_H.pathItems.add();
                    symbH[c].name = "symbH" + c
                    if (monSymbole === "fleche"){
                        DessinerFleche(symbH[c]);
                    }else{
                        DessinerSlash(symbH[c]);
                    };
                };
//////////// Width dimension attachment lines
                var ligneAtt_L = new Array();
                for (c=0; c<2;c++){
                    ligneAtt_L[c] = mesure_L.pathItems.add();
                    ligneAtt_L[c].name = "lattL" + c
                    DessinerLigneAtt(ligneAtt_L[c]);
                };
//////////// Height dimension attachment lines
                var ligneAtt_H = new Array();
                for (c=0; c<2;c++){
                    ligneAtt_H[c] = mesure_H.pathItems.add();
                    ligneAtt_H[c].name = "lattH" + c
                    DessinerLigneAtt(ligneAtt_H[c]);
                };
//////////// Texts
                var monTexte = new Array();
                for (c=0; c<2;c++){
                    monTexte[c] = c === 0 ? mesure_L.textFrames.add() : mesure_H.textFrames.add();
                    monTexte[c].textRange.characterAttributes.textFont = app.textFonts.getByName('CenturyGothic')
                    monTexte[c].textRange.size = 12*coefUtil;
                    monTexte[c].filled = true;
                    monTexte[c].stroked = false;
                    monTexte[c].textRange.characterAttributes.fillColor = maNuance;
                    monTexte[c].name = c === 0 ? "textL" : "textH";
                    monTexte[c].contents = c === 0 ? largeurFinale.replace (".", ",") : hauteurFinale.replace (".", ",");
                    monTexte[c].paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                };
                    largTexte_L = gBN("T","textL").width;
                    hautTexte_L = gBN("T","textL").height;
                    gBN("T","textH").rotate(90,true,false,false,false,Transformation.BOTTOMLEFT);
                    largTexte_H = gBN("T","textH").width;
                    hautTexte_H = gBN("T","textH").height;
//////////// Dimension lines (width)
               var ldcL = new Array();
                for (c=0; c<2;c++){
                    ldcL[c] = mesure_L.pathItems.add();
                    ldcL[c].name = "ldcL" + c
                    DessinerLigneDeCote(ldcL[c]);
                };
//////////// Dimension lines (height)
                var ldcH = new Array();
                for (c=0; c<2;c++){
                    ldcH[c] = mesure_H.pathItems.add();
                    ldcH[c].name = "ldcH"+c;
                    DessinerLigneDeCote(ldcH[c]);
                };
//////////// Reposition symbols, texts and lines
                ReposLargeur();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw arrow symbol    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerFleche(maFleche){
    var d = maFleche.name.substr(4,1);
    if (d==="L"){
        var e = maFleche.name.substr(5,1)*2;
        maFleche.setEntirePath([[L[e],L[1]], [L[e]+13,L[1]-4], [L[e]+13, L[1]-2],
                                            [L[e]+6,L[1]], [L[e]+13,L[1]+2], [L[e]+13,L[1]+4], [L[e],L[1]]]);
           maFleche.resize(parseInt(factUtil),parseInt(factUtil),true,false,false,false,false,Transformation.LEFT);
    }else{
        var e = (maFleche.name.substr(5,1)*2)+1;
        maFleche.setEntirePath([[L[0],L[e]], [L[0]+4,L[e]-13], [L[0]+2, L[e]-13], [L[0],L[e]-5.5],
                                           [L[0]-2,L[e]-13], [L[0]-4,L[e]-13], [L[0],L[e]]]);
//////////// Mise à l'échelle suivant facteur utilisateur
           maFleche.resize(factUtil,factUtil,true,false,false,false,false,Transformation.TOP)
      };
    maFleche.stroked = false;
    maFleche.filled = true;
    maFleche.fillColor = maNuance;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw slash symbol     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerSlash(monSlash){
    var d = monSlash.name.substr(4,1);
    if (d==="L"){
        var e = monSlash.name.substr(5,1)*2;
    monSlash.setEntirePath([[L[e]+5.5,L[1]+6.5], [L[e]-6.5,L[1]-5.5], [L[e]-5.5,L[1]-6.5],
                                            [L[e]+6.5,L[1]+5.5], [L[e]+5.5,L[1]+6.5]]);
    }else{
        var e = (monSlash.name.substr(5,1)*2)+1
    monSlash.setEntirePath([[L[0]+5.5,L[e]+6.5], [L[0]-6.5,L[e]-5.5], [L[0]-5.5,L[e]-6.5],
                                        [L[0]+6.5,L[e]+5.5], [L[0]+5.5,L[e]+6.5]]);
    }
    monSlash.resize(parseInt(factUtil),parseInt(factUtil),true,false,false,false,false,Transformation.CENTER);
    monSlash.stroked = false;
    monSlash.filled = true;
    monSlash.fillColor = maNuance;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw attachment lines   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerLigneAtt(maLAtt){
    var d = maLAtt.name.substr(4,1)
    if (d==="L"){
        var e = maLAtt.name.substr(5,1)*2
    maLAtt.setEntirePath([[L[e],L[1]],[L[e],L[1]+u]]);
    }else{
        var e = (maLAtt.name.substr(5,1)*2)+1
    maLAtt.setEntirePath([[L[0],L[e]],[L[0]-u,L[e]]]);
    };
    maLAtt.stroked = true;
    maLAtt.filled = false;
    maLAtt.strokeColor = maNuance;
    maLAtt.strokeWidth = epTrait;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw dimension lines  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DessinerLigneDeCote(maLDC){
    var d = maLDC.name.substr(3,1)
    if (d==="L"){
        var e = maLDC.name.substr(4,1)*2;
        if (e === 0){
            maLDC.setEntirePath([[L[0]+esp,L[1]+u-(hautSymb/2)],
            [LCentre-(largTexte_L/2)-esp,L[1]+u-(hautSymb/2)]]);
        } else {
            maLDC.setEntirePath([[L[2]-esp,L[1]+u-(hautSymb/2)],
            [LCentre+(largTexte_L/2)+esp,L[1]+u-(hautSymb/2)]]);
            };
    }else{
        var e = (maLDC.name.substr(4,1)*2)+1
        if (e === 1){
            maLDC.setEntirePath([[L[0]-u+(hautSymb/2),L[1]-esp],
            [L[0]-u+(hautSymb/2),HCentre+(hautTexte_H/2)+esp]]);
        } else {
            maLDC.setEntirePath([[L[0]-u+(hautSymb/2),L[3]+esp],
            [L[0]-u+(hautSymb/2),HCentre-(hautTexte_H/2)-esp]]);
            };
    };
    maLDC.stroked = true;
    maLDC.filled = false;
    maLDC.strokeColor = maNuance;
    maLDC.strokeWidth = epTrait;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Reposition symbols, texts and lines   ///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ReposLargeur(){
        var longLignaAtt = 5*ligAtt;
//  L Dimension (Width)
     if (!nL.value){
        if (largeur>largTexte_L+(esp*4)+(largSymb*2)) {coteL = haut.value  ? "HC" : "BC";
            panRenvoiCoteL.enabled = false;
        } else {
            panRenvoiCoteL.enabled = true;
            if (haut.value===true) {rG.value ? coteL="HrG" :  coteL="HrD";
                      } else {rG.value ? coteL="BrG" : coteL="BrD"};
           };
    }else {coteL = "nL",panRenvoiCoteL.enabled = false};
    
// H Dimension (Height)
  if (!nH.value){
        if (hauteur>hautTexte_H+(esp*4)+(largSymb*2)) {coteH = gauche.value ? "GM" : "DM";
            panRenvoiCoteH.enabled = false;
        } else {
            panRenvoiCoteH.enabled = true;
            if (gauche.value===true) {rH.value ? coteH="GrH" :  coteH="GrB";
                      } else {rH.value ? coteH="DrH" : coteH="DrB"};
           };
    }else {coteH = "nH",panRenvoiCoteH.enabled = false}; 
switch (coteL) {
        case "HC" :
                    gBN("P","symbL0").top = L[1]+u;
                    gBN("P","symbL1").top = L[1]+u;
                    monFichier.pathItems.getByName("symbL1").top = L[1]+u;
                    if (monSymbole === "fleche") {
                        gBN("P","symbL1").rotate(180,true,false,false,false,Transformation.LEFT);
                        gBN("T","textL").top =L[1]+u + (hautTexte_L/4);
                        } else {
                            gBN("T","textL").top =L[1]+u
                            };
                    gBN("T","textL").left =L[0]+((largeur-largTexte_L)/2);
                    break;
        case "BC" :
                    gBN("P","symbL0").top = L[3]-u+hautSymb;
                    gBN("P","symbL1").top = L[3]-u+hautSymb;
                    if (monSymbole === "fleche") {
                        gBN("P","symbL1").rotate(180,true,false,false,false,Transformation.LEFT);
                        gBN("T","textL").top =L[3]-u+(hautTexte_L*0.75);
                        } else {
                            gBN("T","textL").top =L[3]-u+hautTexte_L;
                            };
                    gBN("P","lattL0").top = L[3];
                    gBN("P","lattL1").top = L[3];
                    gBN("T","textL").left =L[0]+((largeur-largTexte_L)/2);
                    gBN("P","ldcL0").top =L[3]-u+(hautSymb/2)+(epTrait/2);
                    gBN("P","ldcL1").top =L[3]-u+(hautSymb/2)+(epTrait/2);
                    break;
        case "HrG" :
                    gBN("P","symbL0").top = L[1]+u;
                    gBN("P","symbL1").top = L[1]+u;
                    if (monSymbole === "fleche") {
                        gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                        gBN("T","textL").top =L[1]+u + (hautTexte_L/4);
                        } else {
                            gBN("T","textL").top =L[1]+u
                            };
                    gBN("P","lattL0").top = L[1]+u;
                    gBN("P","lattL1").top = L[1]+u;
                    gBN("T","textL").left =L[0]-largTexte_L-largSymb-(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[0],L[1]+u-(hautSymb/2)],[L[0]-largSymb-(esp*6),L[1]+u-(hautSymb/2)]]);
                    gBN("P","ldcL1").setEntirePath([[L[2],L[1]+u-(hautSymb/2)],[L[2]-largeur,L[1]+u-(hautSymb/2)]]);
                    break;
        case "HrD" :
                    gBN("P","symbL0").top = L[1]+u;
                    gBN("P","symbL1").top = L[1]+u;
                    if (monSymbole === "fleche") {
                        gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                        gBN("T","textL").top =L[1]+u + (hautTexte_L/4);
                        } else {
                            gBN("T","textL").top =L[1]+u
                            };
                    gBN("P","lattL0").top = L[1]+u;
                    gBN("P","lattL1").top = L[1]+u;
                    gBN("T","textL").left =L[2]+largSymb+(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[2],L[1]+u-(hautSymb/2)],
                    [L[2]+largSymb+(esp*6),L[1]+u-(hautSymb/2)]]);
                    gBN("P","ldcL1").setEntirePath([[L[0],L[1]+u-(hautSymb/2)],
                    [L[0]+largeur,L[1]+u-(hautSymb/2)]]);
                    break;
        case "BrG" :
                    gBN("P","symbL0").top = L[3]-u+hautSymb;
                    gBN("P","symbL1").top = L[3]-u+hautSymb;
                    if (monSymbole === "fleche") {
                        gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                        gBN("T","textL").top =L[3]-u + (hautTexte_L*0.75);
                        } else {
                            gBN("T","textL").top =L[3]-u+hautTexte_L;
                            };
                    gBN("P","lattL0").top = L[3];
                    gBN("P","lattL1").top = L[3];
                    gBN("T","textL").left =L[0]-largTexte_L-largSymb-(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[0],L[3]-u+(hautSymb/2)],
                    [L[0]-largSymb-(esp*6),L[3]-u+(hautSymb/2)]]);
                    gBN("P","ldcL1").setEntirePath([[L[2],L[3]-u+(hautSymb/2)],
                    [L[2]-largeur,L[3]-u+(hautSymb/2)]]);
                    break;
            case "BrD" :
                    gBN("P","symbL0").top = L[3]-u+hautSymb;
                    gBN("P","symbL1").top = L[3]-u+hautSymb;
                    if (monSymbole === "fleche") {
                        gBN("P","symbL0").rotate(180,true,false,false,false,Transformation.LEFT);
                        gBN("T","textL").top =L[3]-u + (hautTexte_L*0.75);
                        } else {
                            gBN("T","textL").top =L[3]-u+hautTexte_L;
                            };
                    gBN("P","lattL0").top = L[3];
                    gBN("P","lattL1").top = L[3];
                    gBN("T","textL").left =L[2]+largSymb+(esp*8) ;
                    gBN("P","ldcL0").setEntirePath([[L[2],L[3]-u+(hautSymb/2)],
                    [L[2]+largSymb+(esp*6),L[3]-u+(hautSymb/2)]]);
                    gBN("P","ldcL1").setEntirePath([[L[0],L[3]-u+(hautSymb/2)],
                    [L[0]+largeur,L[3]-u+(hautSymb/2)]]);
                    break;
            case "nL" :
                    gBN("G","Largeur").remove();
                    break;
    };
switch (coteH) {
        case "GM" :
                gBN("P","symbH0").left = L[0]-u
                gBN("P","symbH1").left = L[0]-u
                if (monSymbole === "fleche") {
                    gBN("P","symbH1").rotate(180,true,false,false,false,Transformation.TOP);
                    gBN("T","textH").left =L[0]-u-(largTexte_H/4);
                } else {
                    gBN("T","textH").left =L[0]-u;
                    };
                gBN("T","textH").top =HCentre+(hautTexte_H/2);
                break;
        case "DM" :
                    gBN("P","symbH0").left= L[2]+u-hautSymb;
                    gBN("P","symbH1").left = L[2]+u-hautSymb;
                    if (monSymbole === "fleche") {
                        gBN("P","symbH1").rotate(180,true,false,false,false,Transformation.TOP);
                        gBN("T","textH").left =L[2]+u-(largTexte_H*0.75);
                        } else {
                            gBN("T","textH").left =L[2]+u-largTexte_H;
                            };
                    gBN("P","lattH0").left = L[2];
                    gBN("P","lattH1").left = L[2];

                    gBN("T","textH").top =HCentre+(hautTexte_H/2);
                    gBN("P","ldcH0").left =L[2]+u-(hautSymb/2)-(epTrait/2);
                    gBN("P","ldcH1").left =L[2]+u-(hautSymb/2)-(epTrait/2);
                break;
        case "GrH" :
                    gBN("P","symbH0").left = L[0]-u;
                    gBN("P","symbH1").left = L[0]-u;
                    if (monSymbole === "fleche") {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                        gBN("T","textH").left =L[0]-u-(largTexte_H/4);
                        } else {
                            gBN("T","textH").left =L[0]-u;
                            };
                    gBN("P","lattH0").left = L[0]-u;
                    gBN("P","lattH1").left = L[0]-u;
                    gBN("T","textH").top =L[1]+hautTexte_H+largSymb+(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[0]-u+(hautSymb/2),L[1]],[L[0]-u+(hautSymb/2),L[1]+largSymb+(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[0]-u+(hautSymb/2),L[3]],[L[0]-u+(hautSymb/2),L[1]]]);
                    break;
        case "GrB" :
                    gBN("P","symbH0").left = L[0]-u;
                    gBN("P","symbH1").left = L[0]-u;
                    if (monSymbole === "fleche") {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                        gBN("T","textH").left =L[0]-u-(largTexte_H/4);
                        } else {
                            gBN("T","textH").left =L[0]-u;
                            };
                    gBN("P","lattH0").left = L[0]-u;
                    gBN("P","lattH1").left = L[0]-u;
                    gBN("T","textH").top =L[3]-largSymb-(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[0]-u+(hautSymb/2),L[3]],[L[0]-u+(hautSymb/2),L[3]-largSymb-(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[0]-u+(hautSymb/2),L[1]],[L[0]-u+(hautSymb/2),L[3]]]);
                    break;
        case "DrH" :
                    gBN("P","symbH0").left= L[2]+u-hautSymb;
                    gBN("P","symbH1").left = L[2]+u-hautSymb;
                    if (monSymbole === "fleche") {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                        gBN("T","textH").left =L[2]+u-(largTexte_H*0.75);
                        } else {
                            gBN("T","textH").left =L[2]+u-largTexte_H;
                            };
                    gBN("P","lattH0").left = L[2];
                    gBN("P","lattH1").left = L[2];
                    gBN("T","textH").top =L[1]+hautTexte_H+largSymb+(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[2]+u-(hautSymb/2),L[1]],[L[2]+u-(hautSymb/2),L[1]+largSymb+(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[2]+u-(hautSymb/2),L[3]],[L[2]+u-(hautSymb/2),L[1]]]);
                    break;
        case "DrB" :
                    gBN("P","symbH0").left= L[2]+u-hautSymb;
                    gBN("P","symbH1").left = L[2]+u-hautSymb;
                    if (monSymbole === "fleche") {
                        gBN("P","symbH0").rotate(180,true,false,false,false,Transformation.TOP);
                        gBN("T","textH").left =L[2]+u-(largTexte_H*0.75);
                        } else {
                            gBN("T","textH").left =L[2]+u-largTexte_H;
                            };
                    gBN("P","lattH0").left = L[2];
                    gBN("P","lattH1").left = L[2];
                    gBN("T","textH").top =L[3]-largSymb-(esp*8) ;
                    gBN("P","ldcH0").setEntirePath([[L[2]+u-(hautSymb/2),L[3]],[L[2]+u-(hautSymb/2),L[3]-largSymb-(esp*6)]]);
                    gBN("P","ldcH1").setEntirePath([[L[2]+u-(hautSymb/2),L[1]],[L[2]+u-(hautSymb/2),L[3]]]);
                    break;
        case "nH" :
                    gBN("G","Hauteur").remove();
                break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Draw the  aligned dimension  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function  dessinerCotationALIG() {
recueilDonnees();
///////// Create a group for the different items
        var maCote = cCalque.groupItems.add();
        maCote.name = "Cote";
///////// Creation arrowheads and add  to group "maCote"
        var symb_1 = maCote.pathItems.add();
             symb_1.stroked = false;
             symb_1.filled = true;
             symb_1.fillColor = maNuance;
             symb_1.name="symb1"
         var symb_2 = maCote.pathItems.add();
             symb_2.stroked = false;
             symb_2.filled = true;
             symb_2.fillColor = maNuance;
             symb_2.name="symb2"
///////// Draw symbols
        if(monSymbole=== "fleche"){
                symb_1.setEntirePath([[x,y+u-4], [x+13,y+u], [x+13, y+u-2], [x+6,y+u-4],
                                                    [x+13,y+u-6], [x+13,y+u-8], [x,y+u-4]]);
                symb_2.setEntirePath([[x + maLongueur,y+u-4], [x + maLongueur-13,y+u],
                                                    [x + maLongueur-13, y+u-2], [x + maLongueur-6,y+u-4],
                                                    [x + maLongueur-13,y+u-6], [x + maLongueur-13,y+u-8],
                                                    [x + maLongueur,y+u-4]]);
                symb_1.resize(factUtil,factUtil,true,false,false,false,false,Transformation.LEFT);
                symb_2.resize(factUtil,factUtil,true,false,false,false,false,Transformation.RIGHT);
       } else {
                symb_1.setEntirePath([[x+5.5,y+u+2.5], [x+6.5,y+u+1.5], [x-5.5,y+u-10.5],
                                                    [x-6.5,y+u-9.5], [x+5.5,y+u+2.5]]);
                symb_2.setEntirePath([[x + maLongueur+5.5,y+u+2.5], [x + maLongueur+6.5,y+u+1.5], 
                                                    [x + maLongueur-5.5,y+u-10.5],[x + maLongueur-6.5,y+u-9.5],
                                                    [x + maLongueur+5.5,y+u+2.5]]);
                symb_1.resize(factUtil,factUtil,true,false,false,false,false,Transformation.CENTER);
                symb_2.resize(factUtil,factUtil,true,false,false,false,false,Transformation.CENTER);
       };
///////// Create a text frame and add  to group "maCote"
        var monTexte = maCote.textFrames.add();
                monTexte.textRange.characterAttributes.textFont = app.textFonts.getByName('CenturyGothic');
                monTexte.textRange.size = 12*coefUtil;
                monTexte.filled = true;
                monTexte.stroked = false;
                monTexte.textRange.characterAttributes.fillColor = maNuance;
                monTexte.contents = maLongueurFinale;
                monTexte.paragraphs[0].paragraphAttributes.justification = Justification.CENTER;
                monTexte.name = "valeur"
        var largTexte = monTexte.width;
        var hautTexte = monTexte.height;
               monTexte.top =y+u -4+ (hautTexte/2);
        if (maLongueur > largTexte * 1.2) {
            monTexte.left =x+((maLongueur-largTexte)/2);
        }else{
                if(monRenvoi==="A"){
                        monTexte.left =x + (maLongueur + largSymb + (esp*8)) ;
                }else{
                        monTexte.left =x-largSymb-(esp*8)-largTexte ;
                };
        };
///////// Rotate arrow if the dimension is offset
        if(monSymbole=== "fleche"){
                if (maLongueur < largTexte * 1.2) {
                        symb_1.rotate(180,true,false,false,false,Transformation.LEFT);
                        symb_2.rotate(180,true,false,false,false,Transformation.RIGHT);
                };
        };
///////// Create the dimension lines
     /// Dimension line 1
        var lgCot1 = maCote.pathItems.add();
        lgCot1.stroked = true;
        lgCot1.filled = false;
        if (maLongueur > largTexte * 1.2) {
                lgCot1.setEntirePath([[x+esp,y+u-4],[x-esp+(maLongueur-(largTexte*1.2))/2,y+u-4]]);
        }else{
          lgCot1.setEntirePath([[x,y+u-4],[x+maLongueur,y+u-4]]); 
        };
        lgCot1.strokeWidth = epTrait;
        lgCot1.strokeColor = maNuance;
     /// Dimension line 2
        var lgCot2 = maCote.pathItems.add()
        lgCot2.stroked = true;
        lgCot2.filled = false;
        if (maLongueur > largTexte * 1.2) {
                    lgCot2.setEntirePath([[x+(maLongueur+(largTexte *1.2))/2,y+u-4],[x-esp+maLongueur,y+u-4]]);
                    panRenvoiCote.enabled = false;
        }else{
            panRenvoiCote.enabled = true;
            if(monRenvoi==="A"){
                    lgCot2.setEntirePath([[x+maLongueur,y+u-4],[x+maLongueur+ largSymb +(esp*6),y+u-4]]);
            }else{
                    lgCot2.setEntirePath([[x,y+u-4],[x-largSymb-(esp*6),y+u-4]]);
            };
        };
        lgCot2.strokeWidth = epTrait;
        lgCot2.strokeColor = maNuance;
///////// Create attachment lines
        var lgAtt1 = maCote.pathItems.add();
        lgAtt1.setEntirePath([[x,y],[x,y+u]]);
        lgAtt1.stroked = true;
        lgAtt1.filled = false;
        lgAtt1.strokeColor = maNuance;
        lgAtt1.strokeWidth = epTrait;
        lgAtt1.name = "lgAtt1"
        var lgAtt2 = maCote.pathItems.add();
        lgAtt2.setEntirePath([[x+maLongueur,y],[x+maLongueur,y+u]]);
        lgAtt2.stroked = true;
        lgAtt2.filled = false;
        lgAtt2.strokeColor = maNuance;
        lgAtt2.strokeWidth = epTrait;
        lgAtt2.name = "lgAtt2"
////////// Position of the dimension
       var monAngle
        monAngle = Math.atan2(cote1,cote2)*180/Math.PI;
        if (cote1<0) {
            if (cote2<0) {
                if (invSens) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
                }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1),true,true,true,true);
                };
            }else{
                if (invSens) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
               }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1),true,true,true,true);
               };
            };
       }else{
            if (cote2<0) {
                if (invSens) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1),true,true,true,true);
                }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0];
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1];
                        larglignAttRef = gBN("P","lgAtt1").width;
                        hautlignAttRef = gBN("P","lgAtt1").height;
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
                };
            }else{
                if (invSens) {
                        maCote.rotate(270-monAngle,true,true,true,true,Transformation.BOTTOM);
                        monTexte.rotate(180,true,true,true,true,Transformation.CENTER)
                        X_lgAtt1 = gBN("P","lgAtt1").position[0]
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1]
                        larglignAttRef = gBN("P","lgAtt1").width
                        hautlignAttRef = gBN("P","lgAtt1").height
                        maCote.translate((x-X_lgAtt1),(y-Y_lgAtt1),true,true,true,true);
                }else{
                        maCote.rotate(90-monAngle,true,true,true,true,Transformation.BOTTOM);
                        X_lgAtt1 = gBN("P","lgAtt1").position[0]
                        Y_lgAtt1 = gBN("P","lgAtt1").position[1]
                        larglignAttRef = gBN("P","lgAtt1").width
                        hautlignAttRef = gBN("P","lgAtt1").height
                        maCote.translate((x-X_lgAtt1-larglignAttRef),(y-Y_lgAtt1+hautlignAttRef),true,true,true,true);
                };
            };
        };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Decode colour   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function decoderCouleur (couleurChoisie) {
    maNuance = RGBColor;
    switch (couleurChoisie) {

    case "Black" :
                maNuance.red = 0;maNuance.green = 0;maNuance.blue = 0;
                return (maNuance);break;
    case  "Magenta" :
                maNuance.red = 230;maNuance.green = 0;maNuance.blue = 126;
                return (maNuance);break;
    case  "Cyan" :
                maNuance.red = 0;maNuance.green = 159;maNuance.blue = 227;
                return (maNuance);break;
    case  "Green" :
                maNuance.red = 0;maNuance.green = 118;maNuance.blue = 50;
                return (maNuance);break;
    case  "Yellow" :
                maNuance.red = 255;maNuance.green = 236;maNuance.blue = 66;
                return (maNuance);break;
    case   "White" :
                maNuance.red = 255;maNuance.green = 255;maNuance.blue = 255;
                return (maNuance);break;
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Choose unit   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function choisirUnite(uniteChoisie) {
    switch (uniteChoisie) {
    case "mm" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.02834645*echelle)).toFixed(dec)+ " mm";
                hauteurFinale = (hauteur/(0.02834645*echelle)).toFixed(dec) + " mm";
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.02834645*echelle)).toFixed(dec)+ " mm";
                return (maLongueurFinale);break;
            };
    case  "cm" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.2834645*echelle)).toFixed(dec)+ " cm";
                hauteurFinale = (hauteur/(0.2834645*echelle)).toFixed(dec) + " cm";
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.2834645*echelle)).toFixed(dec)+ " cm";
                return (maLongueurFinale);break;
            };
    case  "inches" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.72*echelle)).toFixed(dec)+ " in";
                hauteurFinale = (hauteur/(0.72*echelle)).toFixed(dec) + " in";
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.72*echelle)).toFixed(dec)+ " in";
                return (maLongueurFinale);break;
            };
    case  "pixels" :
            if (monType === "LIN"){
                largeurFinale = (largeur/(0.01*echelle)).toFixed(dec)+ " px";
                hauteurFinale = (hauteur/(0.01*echelle)).toFixed(dec) + " px";
                return (largeurFinale,hauteurFinale);break;
            } else {
                maLongueurFinale = (maLongueur/(0.01*echelle)).toFixed(dec)+ " px";
                return (maLongueurFinale);break;
            };
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Create dimension layer   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function creation_cCalque() {
	var cCalqueNexistePas = true;
    for(i = 0; i < activeDocument.layers.length; i++){
            if(activeDocument.layers[i].name == "Cotation"){
                cCalque = activeDocument.activeLayer = activeDocument.layers[i]; 
                cCalque.locked = false;
                cCalque.visible = true;
                cCalqueNexistePas = false;
            };
    };
    if(cCalqueNexistePas){
            cCalque = monFichier.layers.add();
            cCalque.name = "Cotation";
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Save settings    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sauverParametres() {
    try{
    if (monType === "LIN"){
        var paramCot = new File(fichierParam.folder + fichierParam.name),
            donnees = [txtEch.text, rdGeo.value,rdVis.value,haut.value,bas.value,nH.value,droite.value,gauche.value,
            nL.value,rD.value,rG.value,rH.value,rB.value, fois1.value, fois2.value, fois3.value,
            fois4.value, fois5.value, txtFactUtil.text, symbFL.value, symbSH.value,
            listeCouleurs.selection.index,listeUnites.selection.index,nbDec.text,mem_chbInverser].toString()
    } else {
        var paramCot = new File(fichierParam.folder + fichierParam.name),
            donnees = [txtEch.text, mem_rdGeo,mem_rdVis,mem_haut,mem_bas,mem_nH,mem_droite,mem_gauche,
            mem_nL,rD.value,rG.value,mem_rH,mem_rB, fois1.value, fois2.value, fois3.value,
            fois4.value, fois5.value, txtFactUtil.text, symbFL.value, symbSH.value,
            listeCouleurs.selection.index,listeUnites.selection.index,nbDec.text,chbInverser.value].toString()
     };
        paramCot.open('w');
        paramCot.write(donnees);
        paramCot.close();
    }catch(e){$.errorMessage(e);}
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    Load settings    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function chargerParametres() {
    var paramCot = File(fichierParam.folder + fichierParam.name);
    if (paramCot.exists) {
        try {
            paramCot.open('r');
            var donnees = paramCot.read().split('\n'),
            mesValeurs = donnees[0].split(',');
            txtEch.text = parseInt(mesValeurs[0]);
            rD.value = (mesValeurs[9]==='true');
            rG.value = (mesValeurs[10]==='true');
            fois1.value = (mesValeurs[13]==='true');
            fois2.value = (mesValeurs[14]==='true');
            fois3.value = (mesValeurs[15]==='true');
            fois4.value = (mesValeurs[16]==='true');
            fois5.value = (mesValeurs[17]==='true');
            txtFactUtil.text = parseInt(mesValeurs[18]);
            symbFL.value = (mesValeurs[19]==='true');
            symbSH.value = (mesValeurs[20]==='true');
            listeCouleurs.selection =mesValeurs[21];
            listeUnites.selection =mesValeurs[22];
            nbDec.text = parseInt(mesValeurs[23]);
        if(monType === "LIN"){
            rdGeo.value = (mesValeurs[1]==='true');
            rdVis.value = (mesValeurs[2]==='true');
            haut.value = (mesValeurs[3]==='true');
            bas.value = (mesValeurs[4]==='true');
            nH.value = (mesValeurs[5]==='true');
            droite.value = (mesValeurs[6]==='true');
            gauche.value = (mesValeurs[7]==='true');
            nL.value = (mesValeurs[8]==='true');
            rH.value = (mesValeurs[11]==='true');
            rB.value = (mesValeurs[12]==='true');
            mem_chbInverser = (mesValeurs[24]==='true');
            return (mem_chbInverser);
        } else {
            chbInverser.value = (mesValeurs[24]==='true');
            mem_rdGeo = (mesValeurs[1]==='true');
            mem_rdVis = (mesValeurs[2]==='true');
            mem_haut = (mesValeurs[3]==='true');
            mem_bas = (mesValeurs[4]==='true');
            mem_nH = (mesValeurs[5]==='true');
            mem_droite = (mesValeurs[6]==='true');
            mem_gauche = (mesValeurs[7]==='true');
            mem_nL = (mesValeurs[8]==='true');
            mem_rH = (mesValeurs[11]==='true');
            mem_rB = (mesValeurs[12]==='true');
            return (mem_rdGeo,mem_rdVis,mem_haut,mem_bas,mem_nH,
            mem_droite,mem_gauche,mem_nL,mem_rH,mem_rB);
        };
            } catch (e) {}
        paramCot.close();
    };
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Verify settings file    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verifDossierParam() {
    var monDossier = new Folder(fichierParam.folder);
    if (!monDossier.exists) monDossier.create();
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   GetByName function    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function gBN(monType,objet) {
    if (monType === "T") {
        monItem = monFichier.textFrames.getByName(objet);
    }else if (monType === "G") {
        monItem = monFichier.groupItems.getByName(objet);
    }else{
        monItem = monFichier.pathItems.getByName(objet);
    };
    return (monItem);
};