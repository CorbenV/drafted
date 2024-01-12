document.addEventListener('DOMContentLoaded', function() {
	let table = document.getElementById("main");
	let mainTableBody = document.getElementById("tableBody");
	let addNotice = document.getElementById("addNotice");
	let storage = document.getElementById("storage");
	function checkEmptyCells(){
		let cells = mainTableBody.getElementsByTagName('td');
		let cellFocused = null
		Array.from(cells).forEach(cell => {
			if (document.activeElement === cell){
				cellFocused = cell;
			}
		});
		Array.from(cells).forEach(cell => {
			if (cellFocused !== cell){
				if (cell.textContent.trim() === '' || cell.textContent.trim() === '-'){
					cell.classList.add("blank");
					cell.textContent = '-';
				}
			}else{
				if (cell.classList.contains("blank")){
					cell.classList.remove("blank");
				}
			}
		});
	}
	document.addEventListener('click',function(event) {
		var target = event.target;
		if (target.tagName === "TD" && !target.querySelector('span')){
			target.contentEditable = true;
			target.textContent = '';
			target.setAttribute('spellcheck', 'false');
			target.focus();
		}else if (target.classList.contains("delete")){
			target.parentNode.parentNode.remove();
			if (mainTableBody.children.length === 0){
				document.getElementById("container").append(addNotice);
			}
		}else if (target.classList.contains("sortUp")){
			let allRows = Array.from(mainTableBody.children);
			let targetRow = allRows.indexOf(target.parentNode.parentNode) - 1;
			mainTableBody.insertBefore(target.parentNode.parentNode, allRows[targetRow]);
		}else if (target.classList.contains("sortDown")){
			let allRows = Array.from(mainTableBody.children);
			let targetRow = allRows.indexOf(target.parentNode.parentNode) + 2;
			if (allRows[(targetRow - 1)]){
				mainTableBody.insertBefore(target.parentNode.parentNode, allRows[targetRow]);
			}else{
				mainTableBody.insertBefore(target.parentNode.parentNode, allRows[0]);
			}
		}
		checkEmptyCells();
	});

	document.addEventListener('keydown', function(event) {
	    var target = event.target;
	    if (document.activeElement === target && event.key === 'Enter') {
	        target.contentEditable = false;
	        event.preventDefault();
	        let ourRow = Array.from(target.parentNode.children);
	        let allRows = Array.from(mainTableBody.children);
	        let currentRow = allRows.indexOf(target.parentNode);
	        let currentCell = ourRow.indexOf(target);
			let targetRow = currentRow + 1;
			if (allRows[targetRow]){
	        	let newRow = allRows[targetRow];
	        	let newCell = newRow.children[currentCell];
	        	newCell.contentEditable = true;
	        	newCell.textContent = '';
				newCell.setAttribute('spellcheck', 'false');
	        	newCell.focus();
	        }
	        checkEmptyCells();
	    }else if(event.key == 'Tab'){
	    	event.preventDefault();
	    }
	});

	let themes = [
		{
			"theme":"light",
			"pcolor":"#000000", //row highlight/accent
			"scolor":"#ebebeb", // textcolor
			"tcolor":"#ffffff", // bg
		},
		{
			"theme":"dark",
			"pcolor":"#7f7f7f",
			"scolor":"#282828",
			"tcolor":"#121212"
		},
		{
			"theme":"sunset",
			"pcolor":"#3f3f3f",
			"scolor":"#282828",
			"tcolor":"#121212"
		},
		{
			"theme":"terminal",
			"pcolor":"#3f3f3f",
			"scolor":"#282828",
			"tcolor":"#121212"
		}
	];

// primary: h1, header text, tr text
// secondary: h2, h3, tr bg
// third: main background, other tr backgrounds

	let currentTheme;

	function applyTheme(index){
		let newTheme = themes[index];
		document.documentElement.style.setProperty('--pcolor', newTheme.pcolor);
		document.documentElement.style.setProperty('--scolor', newTheme.scolor);
		document.documentElement.style.setProperty('--tcolor', newTheme.tcolor);
	}

	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		currentTheme = 1;
	}else{
		currentTheme = 0;
	}

	applyTheme(currentTheme);

	let themeBtn = document.getElementById("theme");
	themeBtn.addEventListener('click',switchTheme);
	function switchTheme(){
		if (currentTheme < (themes.length - 1)){
			currentTheme++;
		}else{
			currentTheme = 0;
		}
		applyTheme(currentTheme);
		console.log(currentTheme);
	}

	let addBtn = document.getElementById("add");
	addBtn.addEventListener('click',addRow);
	function addRow(){
		let clone = document.getElementById("storage").querySelector('table tr').cloneNode(true);
		mainTableBody.appendChild(clone);
		storage.appendChild(addNotice);
	}

	let exportBtn = document.getElementById("export")
	function exportDoc(){
		let workingTable = table.cloneNode(true);
		let heads = workingTable.querySelectorAll('.toolHead')
		let dels = workingTable.querySelectorAll('.deleteCell')
		let ups = workingTable.querySelectorAll('.sortUpCell')
		let downs = workingTable.querySelectorAll('.sortDownCell')

		heads.forEach(head => {
			head.remove();
		});
		dels.forEach(del => {
			del.remove();
		});
		ups.forEach(up => {
			up.remove();
		});
		downs.forEach(down => {
			down.remove();
		});

        const rows = workingTable.querySelectorAll("tr");
        let csvContent = "data:text/csv;charset=utf-8,";

        rows.forEach(function(row) {
            const rowData = [];
            const cols = row.querySelectorAll("td, th");
            cols.forEach(function(col) {
                rowData.push('"' + col.innerText.replace(/"/g, '""') + '"');
            });
            csvContent += rowData.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "drafted_export" + ".csv");
        document.body.appendChild(link);
        link.click();
    }
	exportBtn.addEventListener('click',exportDoc);
});