
PennController.ResetPrefix()

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
// Sequence("intro","paid", shuffle(randomize("items"), randomize("filler")), SendResults(), "end")
Sequence("items", SendResults(), "end")

// Rename the progress bar
var progressBarText = "Fortschritt"

// Instructions
newTrial("instructions",
    newHtml("intro", "intro.html")
        .center()
        .print()
    ,
    newButton("intro_next", "Weiter")
        .center()
        .print()
        .wait()
)

// Consent
newTrial("consent",
    newHtml("consent", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("Sie müssen der Datenschutzerklärung zustimmen, um am Experiment teilnehmen zu können.")
        .center()
        .print()
    ,
    newButton("consent_next", "Weiter")
        .center()
        .print()
        .wait(getHtml("consent").test.complete()
            .failure(getHtml("consent").warn())
        )
)

// Prolific ID
newTrial("paid",
    // Remove instructions after button press
    newText("paid_text", "Bitte geben Sie Ihre Clickworker-ID ein, bevor Sie fortfahren.")
        .center()
        .print()
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newButton("start", "Weiter zur Übungsphase")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait(getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    newVar("ID")
        .global()
        .set(getTextInput("inputID"))
)
        
// Experimental trials      
customTrial = label => row =>
    newTrial(label,
        // Trial instructions
        newText("instructions", "Drücken Sie die Leertaste, um den nächsten Satz zu lesen.")
            .center()
            .print()
        ,
        newKey("keypress", " ")
            .wait()  
        ,
        getText("instructions")
            .remove()
        ,
        // SPR
        newController("DashedSentence", {s: row.Stim, display: "in place", blankText: '+'})
            .center()
            .print()
            .log()      // Make sure to log the participant's progress
            .wait()
            .remove(),
            
                // Grammaticality Judgement
        // Frage
        newText("grammaticality", "Wie natürlich ist der Satz?")
            .center()
            .css("margin","2em") 
            .print()
            ,
      
        // Skala generieren
        newScale("7pt", "1","2","3","4","5","6","7")
            .labelsPosition("top")
            .keys()
            .center()
            .print()
            ,
        // Hilfetext
        newText("accrat-help", '<div class="hilfetext"><span>1 = überhaupt nicht natürlich, 7 = vollkommen natürlich</span></div>')
            .center()
            .css("margin","1em") 
            .print()
            ,
        // Abgabe-Button
        newButton("scale_next", "Antwort abgeben")
            .print()
             .wait( getScale("answer").test.selected() 
                  .failure(newText("Sie müssen einen Wert auf der Skala wählen, brvor Sie fortfahren."))
             )    
        // Antwort erfassen und Skala entfernen
        getScale("7pt")
            .log()
            .wait()
            .remove()
            ,
        // Textelemente entfernen
        getText("accrat-help")
            .remove()
  )
  .log("form", row.Form)
  .log("tokenset", row.TokenSet)
  .log("ID", getVar("ID"))
  
// Übungsphase, Items und Filler ausführen
// Template("practice.csv", customTrial("practice") )
Template("items.csv", customTrial("items") )
// Template("filler.csv", customTrial("filler") )
    
// Last screen (after the experiment is done) 
newTrial("end"
    ,
    newText("Vielen Dank für Ihre Teilnahme.")
        .center()
        .print()
    ,
    // Prolific Code
    newText("<p style='text-align:center'>Bitte geben Sie folgenden Code bei Clickworker ein, um Ihre Vergütung zu erhalten!  <br/><b>CW CODE EINGEBEN</b></p><p style='text-align:center'>Nachdem Sie den Code bei Clickworker eingegeben haben, können Sie das Browserfenster schließen.")
        .center()
        .print()
    ,
    newButton()
        .wait()             // Wait for a click on a non-displayed button = wait here forever
)

.setOption("countsForProgressBar", false )

// Make sure the progress bar is full upon reaching this last (non-)trial
   
