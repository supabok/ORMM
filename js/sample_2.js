

   // used to capture the value of resize events
   var resizeText = "No Value";


   /**
    * Notifies the SDK that the default ad wishes to move to the expanded state.
    *
    * @requires Ormma
    */
   function expandAd() {
		var pos = ormma.getDefaultPosition();
          var size = ormma.getSize();
          ormma.expand( { x: pos.x, 
                          y: pos.y, 
                                          width: size.width, 
                                          height : 400});
   }


   /**
    * Handles ORMMA errors.
    *
    * @param {evt} Event, the error event
    *
    * @requires Ormma
    */
   function handleErrorEvent( message, action ) {
      var msg = "ORMMA ERROR ";
          if ( action != null ) {
             // error caused by an action       
             msg += "caused by action '" + action + "', ";
      }
      msg += "Message: " + message;
          alert( msg );
   }


   /**
    * Handles Screen Size Changed Events.
    *
    * @param {evt} Event, the screen size changed event
    *
    * @requires Ormma
    */
   function handleKeyboardChangeEvent( open ) {
      var msg = "Keyboard is now: ";
      msg += ( open ) ? "OPEN" : "CLOSED";
      //alert( msg );
   }


   /**
    * Handles Screen Size Changed Events.
    *
    * @param {evt} Event, the screen size changed event
    *
    * @requires Ormma
    */
   function handleScreenSizeChangeEvent( width, height ) {
      var msg = "Screen Size Changed to " + buildSizeText( width, height );;
      //alert( msg );
   }


   /**
    * Handles Size Changed Events.
    *
    * @param {evt} Event, the size changed event
    *
    * @requires Ormma
    */
   function handleSizeChangeEvent( width, height ) {
      var msg = "Ad Size Changed to " + buildSizeText( width, height );;
      //alert( msg );
   }


   /**
    * Handles whenever the state changes.
    *
    * @requires Ormma
    */
   function handleStateChangeEvent( state ) {
      var banner = document.getElementById( 'banner' );
      var resizedad = document.getElementById( 'resizedad' );
      var expandedad = document.getElementById( 'expandedad' );
          if ( state === 'default' ) {
             showDefault();
      }
          else if ( state === 'expanded' ) {
             showExpanded();
      }
          else if ( state === 'resized' ) {
             showResized();
      }
          else if ( state === 'hidden' ) {
             showHidden();
      }
   }
   
   
   /**
    * Opens a new full screen browser.
    *
    * @requires Ormma
        */
   function openBrowser(destURL) {
      ormma.open( destURL );
   }


   /**
    * Handles notifications that the ORMMA SDK is fully open for business.
    *
    * @requires Ormma
    */
   function ORMMAReady() {
      //  start listening for state changes
      ormma.addEventListener( 'error', handleErrorEvent );
      ormma.addEventListener( 'stateChange', handleStateChangeEvent );
          showDefault();
   }


   /**
    * Notifies the SDK that the default ad wishes to be resized.
    *
    * @requires Ormma
    */
   function resizeLarger() {
          // add a special listener for size changes, to make sure it's firing
      ormma.addEventListener( 'sizeChange', handleSizeChangeEvent );
          ormma.resize( 320, 250 );
   }


   /**
    * Notifies the SDK that the resized ad wishes to return to the default state.
    *
    * @requires Ormma
    */
   function resizeSmaller() {
          ormma.close();
   }
   
   
   /**
    * Causes the appropriate elements for the "default" state to be displayed.
        *
        * @requires: Ormma
        */
   function showDefault() {
         banner.style.display = 'block';
         resizedad.style.display = 'none';
         expandedad.style.display = 'none';

         // we only care about the size changed event if we're resizing
         ormma.removeEventListener( 'sizeChange', handleSizeChangeEvent );
         resizeText = "No Value";
   }
   
   
   /**
    * Causes the appropriate elements for the "expanded" state to be displayed.
        *
        * @requires: Ormma
        */
   function showExpanded() {
         banner.style.display = 'none';
         resizedad.style.display = 'none';
         expandedad.style.display = 'block';
         updateExpandedAd();
   }
   
   
   
   /**
    * Causes the appropriate elements for the "resized" state to be displayed.
        *
        * @requires: Ormma
        */
   function showResized() {
         banner.style.display = 'none';
         resizedad.style.display = 'block';
         expandedad.style.display = 'none';
         updateResizedAd();
   }


   /**
    * Notifies the SDK that the expanded ad wishes to return to the default state.
    *
    * @requires Ormma
    */
   function shrinkAd() {
          ormma.close();
   }


   /**
    * Helper that updates the contents of the expanded state.
    *
    * @requires Ormma
    */
   function updateExpandedAd() {
   }


   /**
    * Helper Function to build a size text from the specified diminsions.
    */
   function buildSizeText( width, height ) {
      var text = width;
      text += " x ";
      text += height;

      return text;
   }
   
   function clickToApp(destURL){
                window.location = destURL;   
   }
        
