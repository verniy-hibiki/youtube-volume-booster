// ==UserScript==
// @name         YouTube Volume Booster
// @namespace    bep.moe
// @version      1.0
// @description  Boost YouTube video volume by 150%
// @author       Bep
// @match        *://*.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isVolumeBoosted = false;
    let audioContext = null;
    let gainNode = null;
    let sourceNode = null;

    function createButton() {
        const existingButton = document.getElementById('volume-boost-button');
        if (existingButton) return;

        const button = document.createElement('button');
        button.id = 'volume-boost-button';
        button.style.padding = '4px';
        button.style.backgroundColor = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px';

        // SVG Icon
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', '24');
        icon.setAttribute('height', '24');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.innerHTML = '<path id="volume-boost-icon" fill="#555" d="M3 10v4h4l5 5V5l-5 5H3zm13.5-5.5v1.71c1.96 1.31 3 3.54 3 6.29s-1.04 4.98-3 6.29v1.71c2.77-1.73 4.5-4.97 4.5-8s-1.73-6.27-4.5-8zm0 3.5v1.71c.76.68 1.5 1.79 1.5 3.29s-.74 2.61-1.5 3.29v1.71c1.51-.93 2.5-2.57 2.5-5s-.99-4.07-2.5-5z"></path>';
        button.appendChild(icon);

        button.addEventListener('click', toggleVolumeBoost);

        const timeContainer = document.querySelector('.ytp-time-display');
        if (timeContainer) {
            timeContainer.parentElement.appendChild(button);
            console.log('Volume boost button added to controls.');
        } else {
            console.log('Time container not found.');
        }
    }

    function setupAudioContext(video) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioContext.createMediaElementSource(video);
            gainNode = audioContext.createGain();
            sourceNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
        }
    }

    function toggleVolumeBoost() {
        const video = document.querySelector('video');
        if (!video) {
            console.log('Video element not found.');
            return;
        }

        setupAudioContext(video);

        if (isVolumeBoosted) {
            gainNode.gain.setValueAtTime(1, audioContext.currentTime);
            isVolumeBoosted = false;
            document.getElementById('volume-boost-icon').setAttribute('fill', '#555');
            console.log('Volume reset to original.');
        } else {
            gainNode.gain.setValueAtTime(2.5, audioContext.currentTime); // Boost volume by 150%, change to however much you want to boost by
            isVolumeBoosted = true;
            document.getElementById('volume-boost-icon').setAttribute('fill', '#1E90FF');
            console.log('Volume boosted by 150%.');
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        const timeContainer = document.querySelector('.ytp-time-display');
        if (timeContainer && !document.getElementById('volume-boost-button')) {
            createButton();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });

    // Initial button creation
    window.addEventListener('load', createButton);
})();
