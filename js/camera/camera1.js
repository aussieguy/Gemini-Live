/**
 * Manages camera access, capture, and image processing
 */
export class CameraManager {
    /**
     * @param {Object} config
     * @param {number} config.width - Target width for resizing captured images
     * @param {number} config.quality - JPEG quality (0-1)
     * @param {string} [config.facingMode] - Camera facing mode (optional, mobile-only)
     */
    constructor(config) {
        this.config = {
            width: config.width || 640,
            quality: config.quality || 0.8,
            facingMode: config.facingMode // undefined by default for desktop compatibility
        };
        
        this.stream = null;
        this.videoElement = null;
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.aspectRatio = null;
        this.previewContainer = null;
        this.switchButton = null;
    }

    /**
     * Show the camera preview
     */
    showPreview() {
        if (this.previewContainer) {
            this.previewContainer.style.display = 'block';
            const stopButton = document.getElementById('cameraStopBtn');
            if (stopButton) {
                stopButton.style.display = 'block';
            }
        }
    }

    /**
     * Hide the camera preview
     */
    hidePreview() {
        if (this.previewContainer) {
            this.previewContainer.style.display = 'none';
            const stopButton = document.getElementById('cameraStopBtn');
            if (stopButton) {
                stopButton.style.display = 'none';
            }
        }
    }

    /**
     * Create and append the camera switch button
     * @private
     */
    _createSwitchButton() {
        // Only create button on mobile devices
        if (!/Mobi|Android/i.test(navigator.userAgent)) return;

        this.switchButton = document.createElement('button');
        this.switchButton.className = 'camera-switch-btn';
        this.switchButton.innerHTML = '⟲';
        this.switchButton.addEventListener('click', () => this.switchCamera());
        this.previewContainer.appendChild(this.switchButton);
    }

    /**
     * Switch between front and back cameras
     */
    async switchCamera() {
        if (!this.isInitialized) return;
        
        // Toggle facingMode
        this.config.facingMode = this.config.facingMode === 'user' ? 'environment' : 'user';
        localStorage.setItem('facingMode', this.config.facingMode);
        
        // Stop current stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        // Reinitialize with new facingMode
        try {
            const constraints = {
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: this.config.facingMode
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = this.stream;
            await this.videoElement.play();
        } catch (error) {
            console.error('Failed to switch camera:', error);
            // Revert to previous facing mode on error
            this.config.facingMode = localStorage.getItem('facingMode') || 'environment';
        }
    }

    /**
     * Initialize camera stream and canvas
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // Build constraints based on platform
            const constraints = {
                video: {
                    width: { ideal: 1920 }, // Request max quality first
                    height: { ideal: 1080 }
                }
            };

            // Set initial facingMode on mobile
            if (/Mobi|Android/i.test(navigator.userAgent)) {
                this.config.facingMode = this.config.facingMode || 'user'; // Default to front camera
                constraints.video.facingMode = this.config.facingMode;
            }

            // Request camera access
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Create and setup video element
            this.videoElement = document.createElement('video');
            this.videoElement.srcObject = this.stream;
            this.videoElement.playsInline = true;

            // Reduce size.
            
            this.videoElement.width = "640";
            this.videoElement.height = "480";
            this.videoElement.style.width = '100%'; // Responsive width
            // this.videoElement.style.height = 'auto'; // Maintain aspect ratio
            // this.videoElement.style.objectFit = 'cover'; // Cover the container
            // this.videoElement.style.borderRadius = '8px'; // Rounded corners
            // this.videoElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Shadow effect
            // this.videoElement.style.transition = 'transform 0.3s ease'; // Smooth transition
            // this.videoElement.style.transform = 'scale(1.05)'; // Slight zoom effect
            // this.videoElement.style.margin = '0 auto'; // Center the video
            // this.videoElement.style.display = 'block'; // Block display for centering
            
            // Add video to preview container
            const previewContainer = document.getElementById('cameraPreview');
            if (previewContainer) {
                previewContainer.appendChild(this.videoElement);
                this.previewContainer = previewContainer;
                this._createSwitchButton();
                this._initializeStopButton();
                this.showPreview();
            }
            
            await this.videoElement.play();

            // Get the actual video dimensions
            const videoWidth = this.videoElement.videoWidth;
            const videoHeight = this.videoElement.videoHeight;
            this.aspectRatio = videoHeight / videoWidth;

            // Calculate canvas size maintaining aspect ratio
            const canvasWidth = this.config.width;
            const canvasHeight = Math.round(this.config.width * this.aspectRatio);

            // Create canvas for image processing
            this.canvas = document.createElement('canvas');
            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            this.ctx = this.canvas.getContext('2d');

            this.isInitialized = true;
        } catch (error) {
            throw new Error(`Failed to initialize camera: ${error.message}`);
        }
    }

    /**
     * Initialize the stop button functionality
     * @private
     */
    _initializeStopButton() {
        const stopButton = document.getElementById('cameraStopBtn');
        if (stopButton) {
            stopButton.addEventListener('click', () => {
                // Stop camera
                this.dispose();
                
                // Update camera button state
                const cameraBtn = document.getElementById('cameraBtn');
                if (cameraBtn) {
                    cameraBtn.style.backgroundImage = "url('./images/webcam-muted.png')";
                    cameraBtn.style.backgroundSize = 'contain';
                    cameraBtn.style.backgroundPosition = 'center';
                    cameraBtn.style.backgroundRepeat = 'no-repeat';
                    cameraBtn.style.width = '60px';
                    cameraBtn.style.height = '60px';    
                    
                    cameraBtn.classList.remove('active');
              
                }

                // Update microphone button state and stop audio
                const micBtn = document.getElementById('micBtn');
                if (micBtn) {

                    micBtn.style.backgroundImage = "url('./images/microphone-muted.png')";
                    micBtn.style.backgroundSize = 'contain';
                    micBtn.style.backgroundPosition = 'center';
                    micBtn.style.backgroundRepeat = 'no-repeat';
                    micBtn.style.width = '60px';
                    micBtn.style.height = '60px';

                    micBtn.classList.remove('active');
                }

                // Emit a custom event that the agent can listen to
                const event = new CustomEvent('camera_stop_clicked');
                document.dispatchEvent(event);
            });
        }
    }

    /**
     * Get current canvas dimensions
     * @returns {{width: number, height: number}}
     */
    getDimensions() {
        if (!this.isInitialized) {
            throw new Error('Camera not initialized. Call initialize() first.');
        }
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * Capture and process an image from the camera
     * @returns {Promise<string>} Base64 encoded JPEG image
     */
    async capture() {
        if (!this.isInitialized) {
            throw new Error('Camera not initialized. Call initialize() first.');
        }

        // Draw current video frame to canvas, maintaining aspect ratio
        this.ctx.drawImage(
            this.videoElement,
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        // Convert to base64 JPEG with specified quality
        return this.canvas.toDataURL('image/jpeg', this.config.quality).split(',')[1];
    }

    /**
     * Stop camera stream and cleanup resources
     */
    dispose() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.videoElement) {
            this.videoElement.srcObject = null;
            this.videoElement = null;
        }

        if (this.switchButton) {
            this.switchButton.remove();
            this.switchButton = null;
        }

        if (this.previewContainer) {
            this.hidePreview();
            this.previewContainer.innerHTML = ''; // Clear the preview container
            this.previewContainer = null;
        }

        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.aspectRatio = null;
    }
}
