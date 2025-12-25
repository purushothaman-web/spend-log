import React from 'react';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to remove emojis (keep only ASCII printable characters)
const removeEmojis = str => str.replace(/[^\x20-\x7E]/g, '').trim();

function ExportSection({ expenses }) {
  const handleExportCSV = () => {
    // ... (unchanged)
    const csv = Papa.unparse(expenses.map(e => ({
      Name: e.title,
      Category: e.category,
      Amount: e.amount,
      Date: new Date(e.date).toLocaleDateString()
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // --- Header Branding (Matches Navbar) ---
    // "Spend Log" - Blue, Bold, Sans-serif
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // text-blue-600
    doc.setFont('helvetica', 'bold'); // Approx for Poppins
    doc.text('Spend Log', 14, 20);

    // Slogan - Gray, Italic, Serif
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // text-gray-500
    doc.setFont('times', 'italic'); // Approx for Georgia
    doc.text('Track every penny, grow your savings.', 14, 26);

    // Line separator
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.line(14, 32, 196, 32);

    // --- Report Summary ---
    const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 42);
    doc.text(`Total Expenses: Rs. ${totalAmount}`, 14, 48);

    // --- Table ---
    const tableColumn = ["Date", "Title", "Category", "Amount", "Recurring"];
    const tableRows = expenses.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.title,
      removeEmojis(e.category || ''),
      `Rs. ${e.amount}`,
      e.isRecurring ? `Yes (${e.recurrenceInterval})` : 'No'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }, // Blue header
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save('expenses.pdf');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">Export Expenses</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-gray-700 dark:bg-gray-900 text-white rounded px-4 py-2 font-semibold hover:bg-gray-900 dark:hover:bg-gray-700 transition" onClick={handleExportCSV}>Export to CSV</button>
        <button className="bg-blue-500 dark:bg-blue-700 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition" onClick={handleExportPDF}>Export to PDF</button>
      </div>
    </div>
  );
}

export default ExportSection; 