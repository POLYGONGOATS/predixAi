const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for problematic test files...');

// Remove test files from thread-stream that cause build issues
const threadStreamPath = path.join(__dirname, '..', 'node_modules', 'thread-stream');

console.log(`📁 Looking in: ${threadStreamPath}`);

if (fs.existsSync(threadStreamPath)) {
    const testDir = path.join(threadStreamPath, 'test');

    console.log(`📁 Test directory: ${testDir}`);

    if (fs.existsSync(testDir)) {
        console.log('🔧 Removing thread-stream test files to fix build...');
        try {
            fs.rmSync(testDir, { recursive: true, force: true });
            console.log('✅ Test files removed successfully!');
        } catch (error) {
            console.error('❌ Error removing test files:', error.message);
        }
    } else {
        console.log('ℹ️  No test directory found (already clean)');
    }
} else {
    console.log('ℹ️  thread-stream not installed yet');
}
