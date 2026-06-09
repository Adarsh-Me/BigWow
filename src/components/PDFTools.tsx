"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  File,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  RotateCw,
  FilePlus,
  SplitSquareHorizontal,
  FileOutput,
  Info,
  RotateCcw,
  FileImage,
  Type,
  Settings,
  ArrowLeft,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { PDFPreview } from "@/components/pdf-preview";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker for thumbnails and extractions
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PDFFile {
  name: string;
  size: number;
  data: Uint8Array;
  pageCount?: number;
}

interface ImageFile {
  name: string;
  size: number;
  dataUrl: string;
}

type SubToolType =
  | "merge-pdfs"
  | "split-pdf"
  | "compress-pdf"
  | "rotate-pdf"
  | "pdf-to-images"
  | "pdf-to-text"
  | "images-to-pdf"
  | "text-to-pdf"
  | null;

export default function PDFTools({ defaultSubTool }: { defaultSubTool?: SubToolType }) {
  const t = useTranslations("Tools.PDFTools");

  // Dashboard state
  const [selectedSubTool, setSelectedSubTool] = useState<SubToolType>(defaultSubTool ?? null);

  useEffect(() => {
    if (defaultSubTool) {
      setSelectedSubTool(defaultSubTool);
      return;
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sub = params.get("subTool");
      if (sub) {
        setSelectedSubTool(sub as SubToolType);
      }
    }
  }, [defaultSubTool]);

  // Shared file and loader states
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null);
  
  // Specific tool states
  const [pageRanges, setPageRanges] = useState("");
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState("12");
  const [pageOrientation, setPageOrientation] = useState<"p" | "l">("p");

  // Thumbnail states
  const [pdfInfo, setPdfInfo] = useState<{ [key: string]: number }>({});
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [thumbnailLoading, setThumbnailLoading] = useState<{
    [key: string]: boolean;
  }>({});

  // Reset tool states when returning to dashboard
  const handleBackToDashboard = () => {
    setSelectedSubTool(null);
    setFiles([]);
    setImageFiles([]);
    setTextInput("");
    setPageRanges("");
    setLoading(false);
    setPreviewFile(null);
  };

  // --- Thumbnail Generator ---
  const generateThumbnail = async (pdfData: Uint8Array, filename: string) => {
    try {
      setThumbnailLoading((prev) => ({ ...prev, [filename]: true }));

      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        console.warn("PDF.js worker not initialized");
        return;
      }

      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDoc = await loadingTask.promise;
      const page = await pdfDoc.getPage(1);

      const scale = 0.3; // Small scale for thumbnail
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Could not get canvas context");
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const thumbnailUrl = canvas.toDataURL("image/png");
      setThumbnails((prev) => ({ ...prev, [filename]: thumbnailUrl }));
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    } finally {
      setThumbnailLoading((prev) => ({ ...prev, [filename]: false }));
    }
  };

  // --- Tab 1: PDF Dropzone Callbacks ---
  const onDropPDF = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setLoading(true);

        // For single-file tools, replace existing file
        const isSingleFileTool =
          selectedSubTool !== "merge-pdfs";
        
        const newFiles = await Promise.all(
          acceptedFiles.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);

            try {
              const pdf = await PDFDocument.load(data);
              const pageCount = pdf.getPageCount();
              setPdfInfo((prev) => ({ ...prev, [file.name]: pageCount }));

              // Generate thumbnail
              generateThumbnail(data, file.name);

              return {
                name: file.name,
                size: file.size,
                data,
                pageCount,
              };
            } catch (error) {
              toast.error(`Error reading ${file.name}: Invalid PDF file`);
              return null;
            }
          })
        );

        const validFiles = newFiles.filter((file) => file !== null) as PDFFile[];
        
        if (isSingleFileTool) {
          setFiles(validFiles.slice(0, 1));
          if (validFiles.length > 0) {
            toast.success(`Successfully loaded ${validFiles[0].name}`);
          }
        } else {
          setFiles((prev) => [...prev, ...validFiles]);
          if (validFiles.length > 0) {
            toast.success(`Successfully added ${validFiles.length} PDF(s)!`);
          }
        }
      } catch (error) {
        toast.error(t("errorLoadingPdfs") || "Error loading PDFs");
      } finally {
        setLoading(false);
      }
    },
    [selectedSubTool, t]
  );

  const {
    getRootProps: getRootPropsPDF,
    getInputProps: getInputPropsPDF,
    isDragActive: isDragActivePDF,
  } = useDropzone({
    onDrop: onDropPDF,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: selectedSubTool === "merge-pdfs",
  });

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    setFiles(files.filter((_, i) => i !== index));
    toast.success(`Removed ${fileToRemove.name}`);
  };

  // --- Tab 2: Images Dropzone Callbacks ---
  const onDropImages = useCallback(async (acceptedFiles: File[]) => {
    try {
      setLoading(true);
      const newImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          return new Promise<ImageFile>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                name: file.name,
                size: file.size,
                dataUrl: e.target?.result as string,
              });
            };
            reader.onerror = () => reject(new Error("Failed to read image"));
            reader.readAsDataURL(file);
          });
        })
      );
      setImageFiles((prev) => [...prev, ...newImages]);
      toast.success(`Successfully added ${newImages.length} image(s)!`);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Error loading image files.");
    } finally {
      setLoading(false);
    }
  }, []);

  const {
    getRootProps: getRootPropsImg,
    getInputProps: getInputPropsImg,
    isDragActive: isDragActiveImg,
  } = useDropzone({
    onDrop: onDropImages,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...imageFiles];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];
    setImageFiles(newImages);
  };

  const removeImage = (index: number) => {
    const removed = imageFiles[index];
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    toast.success(`Removed ${removed.name}`);
  };

  // --- PDF Actions ---

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error(t("needTwoPdfs") || "Add at least 2 PDFs to merge");
      return;
    }

    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const pdf = await PDFDocument.load(file.data);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      downloadPdf(mergedPdfFile, "merged.pdf");
      toast.success(t("mergedSuccess") || "PDFs merged successfully!");
    } catch (error) {
      toast.error(t("errorMerging") || "Error merging PDFs");
    } finally {
      setLoading(false);
    }
  };

  const splitPDF = async () => {
    if (files.length === 0 || !pageRanges.trim()) return;

    setLoading(true);
    try {
      const targetFile = files[0];
      const pdf = await PDFDocument.load(targetFile.data);
      const totalPages = pdf.getPageCount();

      const ranges = pageRanges.split(",").map((range) => {
        const trimmed = range.trim();
        if (trimmed.includes("-")) {
          const [start, end] = trimmed.split("-").map(Number);
          if (isNaN(start) || isNaN(end)) {
            throw new Error(`Invalid range: ${trimmed}`);
          }
          return { start: start - 1, end: end - 1 };
        } else {
          const page = Number(trimmed);
          if (isNaN(page)) {
            throw new Error(`Invalid page number: ${trimmed}`);
          }
          return { start: page - 1, end: page - 1 };
        }
      });

      for (const range of ranges) {
        if (
          range.start < 0 ||
          range.end >= totalPages ||
          range.start > range.end
        ) {
          throw new Error(
            `Invalid range: pages ${range.start + 1}-${
              range.end + 1
            }. PDF has ${totalPages} pages.`
          );
        }
      }

      let splitCount = 0;
      for (const [index, range] of ranges.entries()) {
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(
          pdf,
          Array.from(
            { length: range.end - range.start + 1 },
            (_, i) => range.start + i
          )
        );
        pages.forEach((page) => newPdf.addPage(page));

        const newPdfBytes = await newPdf.save();
        const filename =
          ranges.length === 1
            ? `${targetFile.name.replace(".pdf", "")}_split.pdf`
            : `${targetFile.name.replace(".pdf", "")}_part_${index + 1}.pdf`;
        downloadPdf(newPdfBytes, filename);
        splitCount++;
      }

      toast.success(`PDF split successfully! Created ${splitCount} file(s).`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error splitting PDF. Check page ranges."
      );
    } finally {
      setLoading(false);
    }
  };

  const compressPDF = async () => {
    if (files.length === 0) return;
    const file = files[0];

    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);

      pdf.setTitle("");
      pdf.setAuthor("");
      pdf.setSubject("");
      pdf.setKeywords([]);
      pdf.setProducer("");
      pdf.setCreator("");

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const originalSize = file.data.length;
      const compressedSize = compressedBytes.length;
      const compressionRatio = (
        ((originalSize - compressedSize) / originalSize) *
        100
      ).toFixed(1);

      if (compressedSize < originalSize) {
        downloadPdf(
          compressedBytes,
          `${file.name.replace(".pdf", "")}_compressed.pdf`
        );
        toast.success(
          `Compressed successfully! ${formatBytes(
            originalSize
          )} → ${formatBytes(compressedSize)} (${compressionRatio}% reduction)`
        );
      } else {
        toast.info(
          t("alreadyOptimized") ||
            "Could not compress further - file is already optimized"
        );
      }
    } catch (error) {
      toast.error(t("errorCompressing") || "Error compressing PDF");
    } finally {
      setLoading(false);
    }
  };

  const rotatePDF = async (degrees: number) => {
    if (files.length === 0) return;
    const file = files[0];

    setLoading(true);
    try {
      const pdf = await PDFDocument.load(file.data);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation();
        page.setRotation({
          type: "degrees",
          angle: currentRotation.angle + degrees,
        } as any);
      });

      const rotatedBytes = await pdf.save();
      downloadPdf(
        rotatedBytes,
        `${file.name.replace(".pdf", "")}_rotated_${degrees}deg.pdf`
      );
      toast.success(`PDF rotated ${degrees}° successfully!`);
    } catch (error) {
      toast.error(t("errorRotating") || "Error rotating PDF");
    } finally {
      setLoading(false);
    }
  };

  const convertPDFToImages = async () => {
    if (files.length === 0) return;
    const file = files[0];

    setLoading(true);
    try {
      const loadingTask = pdfjsLib.getDocument({ data: file.data });
      const pdfDoc = await loadingTask.promise;
      const zip = new JSZip();
      const zipFolderName = file.name.replace(".pdf", "") + "_images";
      const folder = zip.folder(zipFolderName);

      toast.info(`Converting ${pdfDoc.numPages} pages to high-quality JPEGs...`);

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Premium scale
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) continue;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
        );

        if (blob) {
          folder?.file(`page_${pageNum}.jpg`, blob);
        }
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipContent);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${zipFolderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF pages converted and downloaded as ZIP!");
    } catch (error) {
      console.error("PDF to Images error:", error);
      toast.error("Failed to convert PDF pages to images.");
    } finally {
      setLoading(false);
    }
  };

  const convertPDFToText = async () => {
    if (files.length === 0) return;
    const file = files[0];

    setLoading(true);
    try {
      const loadingTask = pdfjsLib.getDocument({ data: file.data });
      const pdfDoc = await loadingTask.promise;
      let fullText = "";

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
      }

      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(".pdf", "")}_text.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF text successfully extracted and downloaded!");
    } catch (error) {
      console.error("PDF to Text error:", error);
      toast.error("Failed to extract text from PDF.");
    } finally {
      setLoading(false);
    }
  };

  const convertImagesToPDF = async () => {
    if (imageFiles.length === 0) return;
    setLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < imageFiles.length; i++) {
        const imgFile = imageFiles[i];
        if (i > 0) {
          pdf.addPage();
        }

        const img = new Image();
        img.src = imgFile.dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = img.naturalWidth;
        let imgHeight = img.naturalHeight;
        const ratio = imgWidth / imgHeight;

        // Auto scaling to center fit
        if (imgWidth > pageWidth - 20) {
          imgWidth = pageWidth - 20;
          imgHeight = imgWidth / ratio;
        }
        if (imgHeight > pageHeight - 20) {
          imgHeight = pageHeight - 20;
          imgWidth = imgHeight * ratio;
        }

        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgFile.dataUrl, "JPEG", x, y, imgWidth, imgHeight);
      }

      pdf.save("images_converted.pdf");
      toast.success("Images compiled and exported as PDF!");
      setImageFiles([]);
    } catch (error) {
      console.error("Images to PDF error:", error);
      toast.error("Failed to compile images to PDF.");
    } finally {
      setLoading(false);
    }
  };

  const convertTextToPDF = () => {
    if (!textInput.trim()) return;
    setLoading(true);
    try {
      const pdf = new jsPDF({
        orientation: pageOrientation,
        unit: "mm",
        format: "a4",
      });

      pdf.setFont("helvetica");
      pdf.setFontSize(Number(fontSize));

      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const maxLineWidth = pageWidth - margin * 2;

      const textLines = pdf.splitTextToSize(textInput, maxLineWidth);

      let y = margin;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const lineHeight = Number(fontSize) * 0.45; // pt to mm height

      for (let i = 0; i < textLines.length; i++) {
        if (y + lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(textLines[i], margin, y);
        y += lineHeight;
      }

      pdf.save("text_document.pdf");
      toast.success("Text compiled and exported as PDF!");
      setTextInput("");
    } catch (error) {
      console.error("Text to PDF error:", error);
      toast.error("Failed to convert text to PDF.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = (data: Uint8Array, filename: string) => {
    const blob = new Blob([data as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Tool Configurations for the Dashboard
  const dashboardTools = [
    {
      id: "merge-pdfs" as SubToolType,
      name: t("mergePdfs") || "Merge PDFs",
      icon: FilePlus,
      description: t("mergeDesc") || "Combine multiple PDF files into one single document",
      colorClass: "text-red-500 bg-red-500/10 dark:bg-red-950/20",
      gradientBorder: "hover:border-red-500/30 hover:shadow-red-500/5",
    },
    {
      id: "split-pdf" as SubToolType,
      name: t("splitPdf") || "Split PDF",
      icon: SplitSquareHorizontal,
      description: t("splitDesc") || "Extract specific pages or page ranges from a PDF",
      colorClass: "text-orange-500 bg-orange-500/10 dark:bg-orange-950/20",
      gradientBorder: "hover:border-orange-500/30 hover:shadow-orange-500/5",
    },
    {
      id: "compress-pdf" as SubToolType,
      name: t("compressPdf") || "Compress PDF",
      icon: FileOutput,
      description: t("compressDesc") || "Reduce PDF file size while preserving high visual quality",
      colorClass: "text-blue-500 bg-blue-500/10 dark:bg-blue-950/20",
      gradientBorder: "hover:border-blue-500/30 hover:shadow-blue-500/5",
    },
    {
      id: "rotate-pdf" as SubToolType,
      name: t("rotatePdf") || "Rotate PDF",
      icon: RotateCw,
      description: t("rotateDesc") || "Rotate PDF pages clockwise or counter-clockwise",
      colorClass: "text-amber-500 bg-amber-500/10 dark:bg-amber-950/20",
      gradientBorder: "hover:border-amber-500/30 hover:shadow-amber-500/5",
    },
    {
      id: "pdf-to-images" as SubToolType,
      name: "PDF to Images",
      icon: FileImage,
      description: "Convert and batch download PDF pages as high-quality JPEGs in a ZIP",
      colorClass: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20",
      gradientBorder: "hover:border-emerald-500/30 hover:shadow-emerald-500/5",
    },
    {
      id: "pdf-to-text" as SubToolType,
      name: "PDF to Text",
      icon: Type,
      description: "Extract text layout from PDF and download as a formatted raw document",
      colorClass: "text-purple-500 bg-purple-500/10 dark:bg-purple-950/20",
      gradientBorder: "hover:border-purple-500/30 hover:shadow-purple-500/5",
    },
    {
      id: "images-to-pdf" as SubToolType,
      name: "Images to PDF",
      icon: FileImage,
      description: "Convert PNG, JPG, JPEG, and WebP images into a single aligned PDF",
      colorClass: "text-pink-500 bg-pink-500/10 dark:bg-pink-950/20",
      gradientBorder: "hover:border-pink-500/30 hover:shadow-pink-500/5",
    },
    {
      id: "text-to-pdf" as SubToolType,
      name: "Text to PDF",
      icon: Type,
      description: "Type, layout, and format custom text and download it as a paginated PDF",
      colorClass: "text-cyan-500 bg-cyan-500/10 dark:bg-cyan-950/20",
      gradientBorder: "hover:border-cyan-500/30 hover:shadow-cyan-500/5",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-2 sm:px-4 md:px-6 space-y-6 font-sans">
      
      {/* ──────────────────────────────────────────────────────────────
         DASHBOARD VIEW (If no tool selected)
         ────────────────────────────────────────────────────────────── */}
      {selectedSubTool === null && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              PDF & Document Utilities
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fast, 100% private, client-side Stirling-PDF workspace in your browser. All operations happen in memory. Your files never touch any external server.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dashboardTools.map((tool) => (
              <Card
                key={tool.id}
                onClick={() => setSelectedSubTool(tool.id)}
                className={cn(
                  "p-5 flex flex-col justify-between border border-border/60 hover:bg-secondary/20 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md",
                  tool.gradientBorder
                )}
              >
                <div className="space-y-4">
                  <div className={cn("p-3 rounded-xl w-fit shrink-0", tool.colorClass)}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-bold text-primary group">
                  <span>Open Tool</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────
         DEDICATED SUB-TOOL WORKSPACES
         ────────────────────────────────────────────────────────────── */}
      {selectedSubTool !== null && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* WorkBench Nav Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToDashboard}
                className="h-9 px-3 rounded-xl hover:bg-secondary transition-colors gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground shrink-0 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Button>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground capitalize flex items-center gap-2">
                  {selectedSubTool.replace("-", " ")}
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedSubTool === "merge-pdfs" && "Combine two or more PDF documents into a single document"}
                  {selectedSubTool === "split-pdf" && "Extract and separate page boundaries from your PDF"}
                  {selectedSubTool === "compress-pdf" && "Reduce file bytes while retaining high-quality DPI renders"}
                  {selectedSubTool === "rotate-pdf" && "Rotate single or batch PDF pages clockwise or counter-clockwise"}
                  {selectedSubTool === "pdf-to-images" && "Export each page frame of your PDF as individual JPEGs packed in a ZIP"}
                  {selectedSubTool === "pdf-to-text" && "Extract layed and parsed text blocks into a clean TXT file"}
                  {selectedSubTool === "images-to-pdf" && "Convert and assemble images seamlessly into an A4 format PDF"}
                  {selectedSubTool === "text-to-pdf" && "Write text and generate structured margins inside a paginated PDF"}
                </p>
              </div>
            </div>
          </div>

          {/* 1. PDF Tools (Merge, Split, Compress, Rotate, PDF to Image, PDF to Text) Dropzone/Files Workspace */}
          {selectedSubTool !== "images-to-pdf" && selectedSubTool !== "text-to-pdf" && (
            <div className="space-y-6">
              
              {/* Dropzone (shown when files count is less than 1, or multiple is allowed like merge-pdfs) */}
              {(files.length === 0 || selectedSubTool === "merge-pdfs") && (
                <Card className="p-4 sm:p-6 border-border/60 hover:shadow-md transition-all duration-300">
                  <div
                    {...getRootPropsPDF()}
                    className={cn(
                      "h-40 sm:h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center space-y-3 p-4 sm:p-8 cursor-pointer transition-all duration-300",
                      isDragActivePDF
                        ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
                        : "border-muted-foreground/35 hover:border-primary/60 hover:bg-primary/5"
                    )}
                  >
                    <input {...getInputPropsPDF()} />
                    <div className="flex flex-col items-center space-y-3 text-center">
                      <div className="p-3 rounded-full bg-primary/10 text-primary transition-transform duration-300 hover:scale-110">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-foreground">
                          {selectedSubTool === "merge-pdfs"
                            ? "Drop multiple PDF files here or click to select"
                            : "Drop your PDF file here or click to select"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedSubTool === "merge-pdfs"
                            ? "Supports multiple PDFs • Drag to reorder after uploading"
                            : "Supports single PDF document • Maximum 50MB"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Uploaded Files Manager */}
              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Uploaded Documents ({files.length})
                    </h3>
                    
                    {/* Add More button for Merge PDFs */}
                    {selectedSubTool === "merge-pdfs" && (
                      <div {...getRootPropsPDF()}>
                        <input {...getInputPropsPDF()} />
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-lg border-dashed">
                          Add More Files
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Desktop Files Table */}
                  <Card className="hidden md:block overflow-hidden border-border/60 shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Preview</TableHead>
                          <TableHead>File Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Pages</TableHead>
                          <TableHead className="w-[120px] text-right pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {files.map((file, index) => (
                          <TableRow key={file.name + index} className="hover:bg-secondary/20">
                            <TableCell>
                              <div
                                className="w-14 h-16 border border-border/50 rounded-lg overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors shadow-sm"
                                onClick={() => setPreviewFile(file)}
                              >
                                {thumbnailLoading[file.name] ? (
                                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                ) : thumbnails[file.name] ? (
                                  <img
                                    src={thumbnails[file.name]}
                                    alt="preview"
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <File className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              <span className="truncate max-w-xs block">{file.name}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatBytes(file.size)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {file.pageCount || pdfInfo[file.name] || "Loading"} pages
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end space-x-1 pr-2">
                                {selectedSubTool === "merge-pdfs" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => moveFile(index, "up")}
                                      disabled={index === 0}
                                    >
                                      <MoveUp className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => moveFile(index, "down")}
                                      disabled={index === files.length - 1}
                                    >
                                      <MoveDown className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setPreviewFile(file)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => removeFile(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  {/* Mobile Files Cards */}
                  <div className="block md:hidden space-y-3">
                    {files.map((file, index) => (
                      <Card key={file.name + index} className="p-4 border border-border/60 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-16 border border-border/50 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
                            onClick={() => setPreviewFile(file)}
                          >
                            {thumbnailLoading[file.name] ? (
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : thumbnails[file.name] ? (
                              <img
                                src={thumbnails[file.name]}
                                alt="preview"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <File className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-foreground block truncate">{file.name}</span>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1 font-semibold">
                              <span>{formatBytes(file.size)}</span>
                              <span>&bull;</span>
                              <span>{file.pageCount || pdfInfo[file.name] || "Loading"} pages</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                          <div className="flex items-center gap-1">
                            {selectedSubTool === "merge-pdfs" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => moveFile(index, "up")}
                                  disabled={index === 0}
                                >
                                  <MoveUp className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => moveFile(index, "down")}
                                  disabled={index === files.length - 1}
                                >
                                  <MoveDown className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-[11px] font-bold gap-1"
                              onClick={() => setPreviewFile(file)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeFile(index)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Dynamic Action Panel tailored for each subtool */}
                  <Card className="p-4 sm:p-6 border border-border/60 bg-secondary/15 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-300">
                    
                    {/* Tool Settings & Exec Controls */}
                    {selectedSubTool === "merge-pdfs" && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm">Ready to Merge</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Documents will be appended in the sequence listed above.
                          </p>
                        </div>
                        <Button
                          onClick={mergePDFs}
                          disabled={files.length < 2 || loading}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 self-end sm:self-auto hover:scale-[1.02] active:scale-98 transition-transform"
                        >
                          {loading ? "Merging PDFs..." : "Merge and Download"}
                        </Button>
                      </div>
                    )}

                    {selectedSubTool === "split-pdf" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                          <Sliders className="w-4 h-4 text-primary" />
                          <h4 className="font-bold text-sm">Configure Splits</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">Page Range Specifier</label>
                            <Input
                              placeholder="e.g. 1-3, 5, 7-9"
                              value={pageRanges}
                              onChange={(e) => setPageRanges(e.target.value)}
                              className="text-xs bg-background h-10 rounded-xl"
                            />
                            <p className="text-[10px] text-muted-foreground">
                              Input page indices separated by commas. Hyphens denote page ranges.
                            </p>
                          </div>
                          <div className="space-y-2 self-end">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageRanges("1")}
                                className="text-xs h-9 rounded-lg"
                              >
                                First Page
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setPageRanges(`1-${files[0]?.pageCount || "N"}`)
                                }
                                className="text-xs h-9 rounded-lg"
                              >
                                All Pages
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageRanges("1-3")}
                                className="text-xs h-9 rounded-lg"
                              >
                                Pages 1 to 3
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={splitPDF}
                          disabled={!pageRanges.trim() || loading}
                          className="w-full h-11 text-xs font-bold rounded-xl hover:scale-[1.01] active:scale-99 transition-transform mt-2"
                        >
                          {loading ? "Splitting..." : "Split PDF and Download"}
                        </Button>
                      </div>
                    )}

                    {selectedSubTool === "compress-pdf" && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm">Ready to Compress</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            We will rebuild document streams to optimize metadata and size.
                          </p>
                        </div>
                        <Button
                          onClick={compressPDF}
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 self-end sm:self-auto hover:scale-[1.02] active:scale-98 transition-transform"
                        >
                          {loading ? "Optimizing..." : "Compress and Download"}
                        </Button>
                      </div>
                    )}

                    {selectedSubTool === "rotate-pdf" && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm">Ready to Rotate</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            We will adjust page viewport attributes dynamically.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => rotatePDF(90)}
                            disabled={loading}
                            className="h-10 rounded-xl text-xs font-bold gap-1 shadow-sm"
                          >
                            <RotateCw className="w-3.5 h-3.5 text-primary" />
                            <span>90° CW</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => rotatePDF(-90)}
                            disabled={loading}
                            className="h-10 rounded-xl text-xs font-bold gap-1 shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-primary" />
                            <span>90° CCW</span>
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedSubTool === "pdf-to-images" && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm">Convert Pages to Image Archive</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Extract high-quality JPEG canvases compressed at 90% quality.
                          </p>
                        </div>
                        <Button
                          onClick={convertPDFToImages}
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 self-end sm:self-auto hover:scale-[1.02] active:scale-98 transition-transform"
                        >
                          {loading ? "Generating ZIP..." : "Convert and Download ZIP"}
                        </Button>
                      </div>
                    )}

                    {selectedSubTool === "pdf-to-text" && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm">Extract PDF Content</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Rebuild text positioning frames page-by-page.
                          </p>
                        </div>
                        <Button
                          onClick={convertPDFToText}
                          disabled={loading}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold shrink-0 self-end sm:self-auto hover:scale-[1.02] active:scale-98 transition-transform"
                        >
                          {loading ? "Parsing text..." : "Extract and Download (.txt)"}
                        </Button>
                      </div>
                    )}

                  </Card>
                </div>
              )}
            </div>
          )}

          {/* 2. Images to PDF Workspace */}
          {selectedSubTool === "images-to-pdf" && (
            <div className="space-y-6">
              
              {/* Dropzone (shown when images count is less than 1, or optionally all the time) */}
              <Card className="p-4 sm:p-6 border-border/60 hover:shadow-md transition-all duration-300 animate-in fade-in duration-300">
                <div
                  {...getRootPropsImg()}
                  className={cn(
                    "h-40 sm:h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center space-y-3 p-4 sm:p-8 cursor-pointer transition-all duration-300",
                    isDragActiveImg
                      ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
                      : "border-muted-foreground/35 hover:border-primary/60 hover:bg-primary/5"
                  )}
                >
                  <input {...getInputPropsImg()} />
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="p-3 rounded-full bg-primary/10 text-primary transition-transform duration-300 hover:scale-110">
                      <FileImage className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground">
                        Drop PNG/JPG/WebP images here or click to select
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PNG, JPG, JPEG, and WebP • Multiple files allowed
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Uploaded Images List Manager */}
              {imageFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Uploaded Images ({imageFiles.length})
                    </h3>
                    <Button
                      onClick={convertImagesToPDF}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-98 transition-transform shadow-sm"
                    >
                      {loading ? "Compiling..." : "Compile into PDF"}
                    </Button>
                  </div>

                  {/* Desktop Image List Table */}
                  <Card className="hidden md:block overflow-hidden border-border/60 shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Preview</TableHead>
                          <TableHead>File Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead className="w-[120px] text-right pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {imageFiles.map((file, index) => (
                          <TableRow key={file.name + index} className="hover:bg-secondary/20">
                            <TableCell>
                              <div className="w-16 h-16 border border-border/50 rounded-lg overflow-hidden bg-muted flex items-center justify-center shadow-sm">
                                <img
                                  src={file.dataUrl}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              <span className="truncate max-w-xs block">{file.name}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatBytes(file.size)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end space-x-1 pr-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-secondary"
                                  onClick={() => moveImage(index, "up")}
                                  disabled={index === 0}
                                >
                                  <MoveUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-secondary"
                                  onClick={() => moveImage(index, "down")}
                                  disabled={index === imageFiles.length - 1}
                                >
                                  <MoveDown className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => removeImage(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  {/* Mobile Image List Cards */}
                  <div className="block md:hidden space-y-3">
                    {imageFiles.map((file, index) => (
                      <Card key={file.name + index} className="p-4 border border-border/60 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 border border-border/50 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm">
                            <img
                              src={file.dataUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-foreground block truncate">{file.name}</span>
                            <span className="text-[11px] text-muted-foreground mt-1 block font-semibold">
                              {formatBytes(file.size)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/40 pt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-secondary"
                              onClick={() => moveImage(index, "up")}
                              disabled={index === 0}
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-secondary"
                              onClick={() => moveImage(index, "down")}
                              disabled={index === imageFiles.length - 1}
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Text to PDF Workspace */}
          {selectedSubTool === "text-to-pdf" && (
            <Card className="p-5 sm:p-6 border border-border/60 shadow-sm space-y-5 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Format Control Panel */}
                <div className="md:col-span-1 space-y-4 bg-secondary/15 p-4 rounded-2xl border border-border/50 self-start">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 pb-2 border-b border-border/40">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Page Layout Options</span>
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Font Size (pt)</label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger className="w-full text-xs bg-background h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["10", "12", "14", "16", "18", "24"].map((size) => (
                          <SelectItem key={size} value={size} className="text-xs">
                            {size} pt
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Page Orientation</label>
                    <Select
                      value={pageOrientation}
                      onValueChange={(v) => setPageOrientation(v as "p" | "l")}
                    >
                      <SelectTrigger className="w-full text-xs bg-background h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p" className="text-xs">
                          Portrait (Vertical)
                        </SelectItem>
                        <SelectItem value="l" className="text-xs">
                          Landscape (Horizontal)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={convertTextToPDF}
                    disabled={!textInput.trim() || loading}
                    className="w-full h-10 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-98 transition-transform shadow-sm"
                  >
                    {loading ? "Generating..." : "Generate PDF"}
                  </Button>
                </div>

                {/* Content Editor area */}
                <div className="md:col-span-2 space-y-2 flex flex-col">
                  <label className="text-xs font-bold text-foreground">Document Content</label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Start typing or paste your content text here..."
                    className="w-full h-80 rounded-2xl border border-border bg-background/50 p-4 text-xs font-mono outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Inline PDF Preview Modal sheet for previews */}
          {previewFile && (
            <Card className="border border-border/60 shadow-sm p-4 animate-in fade-in duration-300">
              <PDFPreview
                pdfData={previewFile.data}
                onClose={() => setPreviewFile(null)}
              />
            </Card>
          )}

        </div>
      )}
    </div>
  );
}
