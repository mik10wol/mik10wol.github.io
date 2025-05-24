(function() {
  // --- Configuration ---
  const trashBinImageSrc = "https://www.elevenforum.com/data/attachments/47/47043-ad477ab1a460ba95a1ac4983faefbd40.jpg?hash=rUd6saRgup";
  const stickyNotesImageSrc = "https://static.vecteezy.com/system/resources/previews/020/949/963/non_2x/stack-of-sticker-notes-with-pin-isolated-png.png";
  const stickyNoteDefaultText = "Type something here...";
  const stickyNoteColor = "yellow";
  const trashBinSize = 50; // pixels
  const stickyNotesSize = 80; // pixels
  const noteWidth = 200; // pixels
  const noteHeight = 150; // pixels
  const noteHandleHeight = 20; // pixels
  const minimiseDuration = 300; // milliseconds

  let trashBin = null;
  let stickyNotesIcon = null;
  let activeNote = null;
  let offsetX, offsetY;

  function createTrashBin() {
    trashBin = document.createElement('img');
    trashBin.src = trashBinImageSrc;
    trashBin.style.position = 'fixed';
    trashBin.style.bottom = '20px';
    trashBin.style.right = '20px';
    trashBin.style.width = `${trashBinSize}px`;
    trashBin.style.height = `${trashBinSize}px`;
    trashBin.style.cursor = 'pointer';
    document.body.appendChild(trashBin);
  }

  function createStickyNotesIcon() {
    stickyNotesIcon = document.createElement('img');
    stickyNotesIcon.src = stickyNotesImageSrc;
    stickyNotesIcon.style.position = 'fixed';
    stickyNotesIcon.style.bottom = '20px';
    stickyNotesIcon.style.right = `${20 + trashBinSize + 20}px`; // Position to the left of the trash bin
    stickyNotesIcon.style.width = `${stickyNotesSize}px`;
    stickyNotesIcon.style.height = `${stickyNotesSize}px`;
    stickyNotesIcon.style.cursor = 'pointer';
    stickyNotesIcon.addEventListener('click', createNewStickyNote);
    document.body.appendChild(stickyNotesIcon);
  }

  function createNewStickyNote() {
    const note = document.createElement('div');
    note.style.position = 'absolute';
    note.style.left = `calc(50% - ${noteWidth / 2}px)`;
    note.style.top = `calc(50% - ${noteHeight / 2}px)`;
    note.style.width = `${noteWidth}px`;
    note.style.height = `${noteHeight}px`;
    note.style.backgroundColor = stickyNoteColor;
    note.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
    note.style.borderRadius = '5px';
    note.style.zIndex = '1000'; // Ensure it's on top

    const handle = document.createElement('div');
    handle.style.height = `${noteHandleHeight}px`;
    handle.style.backgroundColor = '#ddd';
    handle.style.borderBottom = '1px solid #ccc';
    handle.style.cursor = 'grab';
    handle.style.borderRadius = '5px 5px 0 0';
    handle.addEventListener('mousedown', startDrag);
    note.appendChild(handle);

    const content = document.createElement('textarea');
    content.style.width = '100%';
    content.style.height = `calc(100% - ${noteHandleHeight}px)`;
    content.style.border = 'none';
    content.style.padding = '5px';
    content.style.boxSizing = 'border-box';
    content.style.resize = 'none';
    content.style.fontFamily = 'sans-serif';
    content.style.fontSize = '14px';
    content.value = stickyNoteDefaultText;
    note.appendChild(content);

    document.body.appendChild(note);
  }

  function startDrag(e) {
    activeNote = e.target.parentNode;
    offsetX = e.clientX - activeNote.getBoundingClientRect().left;
    offsetY = e.clientY - activeNote.getBoundingClientRect().top;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    activeNote.style.cursor = 'grabbing';
  }

  function drag(e) {
    if (!activeNote) return;
    activeNote.style.left = `${e.clientX - offsetX}px`;
    activeNote.style.top = `${e.clientY - offsetY}px`;
  }

  function endDrag(e) {
    if (!activeNote) return;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
    activeNote.style.cursor = 'grab';

    const noteRect = activeNote.getBoundingClientRect();
    const trashRect = trashBin.getBoundingClientRect();

    // Check for collision with the trash bin
    if (noteRect.right > trashRect.left &&
        noteRect.left < trashRect.right &&
        noteRect.bottom > trashRect.top &&
        noteRect.top < trashRect.bottom) {
      minimiseNote(activeNote);
    }

    activeNote = null;
  }

  function minimiseNote(note) {
    const startWidth = note.offsetWidth;
    const startHeight = note.offsetHeight;
    const startX = note.offsetLeft;
    const startY = note.offsetTop;
    const trashCenterX = trashBin.getBoundingClientRect().left + trashBinSize / 2;
    const trashCenterY = trashBin.getBoundingClientRect().top + trashBinSize / 2;
    const steps = 30;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const newWidth = startWidth * (1 - progress);
      const newHeight = startHeight * (1 - progress);
      const newX = startX + (trashCenterX - (startX + startWidth / 2)) * progress;
      const newY = startY + (trashCenterY - (startY + startHeight / 2)) * progress;
      const newOpacity = 1 - progress;

      note.style.width = `${newWidth}px`;
      note.style.height = `${newHeight}px`;
      note.style.left = `${newX}px`;
      note.style.top = `${newY}px`;
      note.style.opacity = newOpacity;

      if (progress >= 1) {
        clearInterval(interval);
        note.remove();
      }
    }, minimiseDuration / steps);
  }

  // Initialize when the script runs
  createTrashBin();
  createStickyNotesIcon();
})();
