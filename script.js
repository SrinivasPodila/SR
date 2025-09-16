document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('text-to-speech');
    const rateInput = document.getElementById('rate');
    const rateValue = document.getElementById('rate-value');
    const pitchInput = document.getElementById('pitch');
    const pitchValue = document.getElementById('pitch-value');
    const playBtn = document.getElementById('play-btn');
    const downloadBtn = document.getElementById('download-btn');
    const charCount = document.getElementById('char-count');
    
    // Speech synthesis
    const synth = window.speechSynthesis;
    let audioChunks = [];
    let mediaRecorder;
    let audioBlob;
    
    // Populate voice list
    function populateVoiceList() {
        // Always get fresh voices
        voices = synth.getVoices();
        console.log('Populating voice list. Total voices:', voices.length);
        
        // Clear existing options
        voiceSelect.innerHTML = '<option value="">Select a voice...</option>';
        
        if (voices.length === 0) {
            console.warn('No voices available in populateVoiceList');
            return;
        }
        
        // Get the selected language code
        const selectedLang = languageSelect.value || 'en-US';
        console.log('Filtering voices for language:', selectedLang);
        
        // Filter and sort voices
        const filteredVoices = voices
            .filter(voice => {
                // If no language is selected, show all voices
                if (!selectedLang) return true;
                // Otherwise filter by language prefix (e.g., 'en' for English)
                return voice.lang.startsWith(selectedLang.split('-')[0]);
            })
            .sort((a, b) => {
                // Sort by language first, then by name
                if (a.lang < b.lang) return -1;
                if (a.lang > b.lang) return 1;
                
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        
        console.log('Filtered voices:', filteredVoices.length);
        
        // Add voices to dropdown
        filteredVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.voiceURI;
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-name', voice.name);
            option.setAttribute('data-lang', voice.lang);
            voiceSelect.appendChild(option);
        });
        
        // Select the first voice by default if available
        if (filteredVoices.length > 0) {
            voiceSelect.selectedIndex = 1; // Skip the default option
            console.log('Selected default voice:', filteredVoices[0].name);
        }
    }
    
    // Initialize the app
    function init() {
        // No need to populate languages anymore
        
        // First try to load voices immediately
        voices = synth.getVoices();
        if (voices.length > 0) {
            console.log('Voices loaded on init:', voices.length);
            // Voice manager will handle populating the voice list
        } else {
            console.log('No voices available on init, voice manager will handle it');
        }
        
        // Set up the voiceschanged event handler
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = function() {
                console.log('Voices changed event fired');
                voices = synth.getVoices();
                console.log('Voices available after change:', voices.length);
                populateVoiceList();
            };
        }
        
        // Fallback: Try loading voices again after a delay
        setTimeout(() => {
            voices = synth.getVoices();
            if (voices.length > 0) {
                console.log('Voices loaded after timeout:', voices.length);
                populateVoiceList();
            } else {
                console.warn('Still no voices available after timeout');
            }
        }, 1000);
    }
    
    // Update character count
    function updateCharCount() {
        const count = textInput.value.length;
        charCount.textContent = count.toLocaleString();
        
        // Update character count color based on limit
        if (count > 20000) {
            charCount.style.color = '#e74c3c';
        } else if (count > 15000) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '';
        }
    }
    
    // Speak the text
    function speak() {
        // Cancel any ongoing speech
        synth.cancel();

        if (textInput.value.trim() === '') {
            alert('Please enter some text to speak');
            return;
        }

        // Get the selected voice
        const voice = window.voiceManager ? window.voiceManager.getSelectedVoice() : null;
        
        if (!voice) {
            alert('No voices available. Please try again in a moment.');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(textInput.value);
        utterance.voice = voice;
        utterance.rate = parseFloat(rateInput.value) || 1.0;
        utterance.pitch = parseFloat(pitchInput.value) || 1.0;
        
        console.log('Speaking with voice:', voice.name, voice.lang);
        synth.speak(utterance);
        
        // Enable download button when speech starts
        downloadBtn.disabled = false;
    }
    
    // Download audio as MP3
    function downloadAudio() {
        if (!audioBlob) {
            alert('Please generate speech first by clicking the Play button.');
            return;
        }
        
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'axzora-voice-' + new Date().toISOString().slice(0, 10) + '.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // No more language change event listener needed
    
    rateInput.addEventListener('input', () => {
        rateValue.textContent = rateInput.value;
    });
    
    pitchInput.addEventListener('input', () => {
        pitchValue.textContent = pitchInput.value;
    });
    
    playBtn.addEventListener('click', speak);
    downloadBtn.addEventListener('click', downloadAudio);
    
    textInput.addEventListener('input', updateCharCount);
    
    // Initialize the app
    init();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .converter-box');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});
