const fs = require('fs');
let code = fs.readFileSync('src/components/QueueManager.tsx', 'utf8');

code = code.replace(
    "<button\n                            onClick={(e) => { e.stopPropagation(); approveJob(job.id); }}\n                            className=\"p-1 text-emerald-500 hover:text-emerald-600 font-bold ml-2\"\n                            title=\"Approve Plan\"\n                          >\n                            Approve\n                          </button>",
    `<button
                            onClick={(e) => { e.stopPropagation(); approveJob(job.id); }}
                            className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 rounded font-bold ml-2 text-[10px] uppercase tracking-wider transition-colors shadow-sm"
                            title="Human in the loop safety mechanism"
                          >
                            <CheckCircle2 size={14} />
                            Approve & Sign
                          </button>`
);

if (!code.includes("CheckCircle2")) {
    code = code.replace("import { Play, Activity, Clock, CheckCircle, XCircle, AlertCircle, ArrowUp, ArrowDown, X, Trash2 } from 'lucide-react';", "import { Play, Activity, Clock, CheckCircle, XCircle, AlertCircle, ArrowUp, ArrowDown, X, Trash2, CheckCircle2 } from 'lucide-react';");
}

fs.writeFileSync('src/components/QueueManager.tsx', code);
