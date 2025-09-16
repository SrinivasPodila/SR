// Voice management for text-to-speech
function VoiceManager() {
    this.voices = [];
    this.synth = window.speechSynthesis;
    this.voiceSelect = document.getElementById('voice-select');
    this.languageSelect = document.getElementById('language-select');
    this.initialized = false;

    // Initialize voice manager
    this.init = function() {
        // Load voices when they become available
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = this.loadVoices.bind(this);
        }
        
        // Try to load voices immediately
        this.loadVoices();
        
        // Set up language change handler
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', this.loadVoices.bind(this));
        }
    };

    // Load available voices
    this.loadVoices = function() {
        console.log('Loading voices...');
        this.voices = this.synth.getVoices();
        
        if (this.voices.length === 0) {
            console.warn('No voices available. Retrying...');
            setTimeout(this.loadVoices.bind(this), 500);
            return;
        }
        
        console.log('Found', this.voices.length, 'voices');
        this.populateVoiceList();
        this.initialized = true;
    };

    // Populate voice dropdown with only US and UK English voices
    this.populateVoiceList = function() {
        if (!this.voiceSelect) return;
        
        // Save current selection
        const currentVoice = this.voiceSelect.value;
        
        // Clear existing options
        this.voiceSelect.innerHTML = '<option value="">Select a voice...</option>';
        
        // Filter for only US and UK English voices
        const voices = this.voices
            .filter(voice => {
                const lang = voice.lang.toLowerCase();
                return lang.startsWith('en-us') || lang.startsWith('en-gb');
            })
            .sort((a, b) => {
                // Sort by language (US first, then UK), then by name
                const langA = a.lang.toLowerCase();
                const langB = b.lang.toLowerCase();
                
                if (langA.includes('us') && !langB.includes('us')) return -1;
                if (!langA.includes('us') && langB.includes('us')) return 1;
                
                return a.name.localeCompare(b.name);
            });
        
        // Add voices to dropdown
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.voiceURI;
            option.textContent = `${voice.name} (${voice.lang})`;
            this.voiceSelect.appendChild(option);
        });
        
        // Restore selection if possible
        if (currentVoice && this.voiceSelect.querySelector(`option[value="${currentVoice}"]`)) {
            this.voiceSelect.value = currentVoice;
        } else if (voices.length > 0) {
            this.voiceSelect.selectedIndex = 1; // Select first non-default option
        }
    };

    // Get the currently selected voice
    this.getSelectedVoice = function() {
        if (!this.initialized) {
            this.voices = this.synth.getVoices();
        }
        
        const selectedVoiceURI = this.voiceSelect ? this.voiceSelect.value : '';
        if (selectedVoiceURI) {
            // Find the selected voice
            const voice = this.voices.find(v => v.voiceURI === selectedVoiceURI);
            if (voice) return voice;
        }
        
        // Return first available US voice, then UK, then any other
        return this.voices.find(v => v.lang.toLowerCase().startsWith('en-us')) ||
               this.voices.find(v => v.lang.toLowerCase().startsWith('en-gb')) ||
               this.voices[0] || null;
    };
}

// Initialize voice manager when the page loads
window.addEventListener('DOMContentLoaded', function() {
    window.voiceManager = new VoiceManager();
    window.voiceManager.init();
});
