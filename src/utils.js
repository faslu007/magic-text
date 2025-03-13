

export const generateCreativeTitle = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Time-based prefixes
    let timePrefix = '';
    if (hour < 6) timePrefix = 'Night Owl';
    else if (hour < 12) timePrefix = 'Morning Muse';
    else if (hour < 17) timePrefix = 'Afternoon Thoughts';
    else if (hour < 21) timePrefix = 'Evening Notes';
    else timePrefix = 'Night Reflections';

    // Random creative suffixes
    const creativeSuffixes = [
        'Inspiration', 'Ideas', 'Brainstorm', 'Thoughts', 'Journal',
        'Draft', 'Concept', 'Vision', 'Plan', 'Notes', 'Musings'
    ];

    const randomSuffix = creativeSuffixes[Math.floor(Math.random() * creativeSuffixes.length)];

    return `${timePrefix} - ${date} at ${hour}:${minutes} - ${randomSuffix}`;
};