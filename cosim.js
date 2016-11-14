
function buildStopwords(string) {
    
    const stopWords = new Set();
    const wordArray = string.split('\n');
    for (word of wordArray) {
        stopWords.add(word);
    }
    return stopWords;
}

function sanitizeDoc(d, stopWords){
    d = d.toLowerCase();
    d = d.replace(/[^a-z ]/g, "");
    d = d.trim();
    let a = d.split(" ");
    let b = [];
    for (w of a) {
        if(!stopWords.has(w) && w.length > 0) {
            b.push(w);
        }
    }
    return b.join(" ");
}

function buildVectors(d1, d2) {

    function counter(d) {
        
        const counts = new Map();
        for (w of d.split(" ")) {
            if (w.length > 0) {
                if (!counts.has(w)) {
                    counts.set(w, 0);
                }
                counts.set(w, counts.get(w)+1);
            }
        }
        return counts;
    }

    const allWords = new Set();
    const d1Count = counter(d1);
    const d2Count = counter(d2);

    for (j of d1Count.keys()) {
        allWords.add(j);
    }

    for (k of d2Count.keys()) {
        allWords.add(k);
    }

    
    const vSize = allWords.size;
    const v1 = new Array(vSize);
    const v2 = new Array(vSize);

  
    let c = 0;
    for (w of allWords) {
        v1[c] = d1Count.get(w) || 0;
        v2[c] = d2Count.get(w) || 0;
        c++;
    }

    return [v1, v2];
}

function cosim(v1, v2) {
    
    function dotProduct(v1, v2) {
        s = 0;
        for (let i = 0; i < v1.length; i++) {
            s+=v1[i]*v2[i];
        }
        return s;
    }

    function magnitude(v) {
        s = 0;
        for (let i = 0; i < v.length; i++) {
            s+=Math.pow(v[i], 2);
        }
        return Math.sqrt(s);
    }

    return dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
}