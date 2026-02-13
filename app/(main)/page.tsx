"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ImageDropzone } from "@/components/image-dropzone";
import { UploadedImage } from "@/components/uploaded-image";
import { OutputImage } from "@/components/output-image";
import { DesignControls } from "@/components/design-controls";
import { BudgetStatus } from "@/components/budget-status";
import { ProviderInfo } from "@/components/provider-info";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import type {
  RoomType,
  DesignTheme,
  Provider,
  GenerationResponse,
} from "@/types";

const BACKEND_URL = "http://localhost:8000";

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<DesignTheme>("Modern");
  const [selectedRoom, setSelectedRoom] = useState<RoomType>("Living Room");
  const [selectedProvider, setSelectedProvider] = useState<Provider>("offline");
  const [budget, setBudget] = useState<number>(200000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] =
    useState<GenerationResponse | null>(null);

  const handleImageUpload = useCallback((base64: string, file?: File) => {
    setUploadedImage(base64);
    setUploadedFile(file || null);
    setOutputImage(null);
    setError(null);
    setGenerationResult(null);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setUploadedFile(null);
    setOutputImage(null);
    setError(null);
    setGenerationResult(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputImage(null);
    setGenerationResult(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("room_type", selectedRoom);
      formData.append("style", selectedTheme);
      formData.append("budget", budget.toString());
      formData.append("provider", selectedProvider);

      // Call backend API
      const response = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        body: formData,
      });

      const data: GenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).detail || "Failed to generate design");
      }

      // Set results
      setOutputImage(data.image_url);
      setGenerationResult(data);
      toast.success("Design generated successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      handleError(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    uploadedFile,
    selectedRoom,
    selectedTheme,
    budget,
    selectedProvider,
    handleError,
  ]);

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="leading-relaxed">
            Upload a photo of your room and let AI reimagine it with a new
            design style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DesignControls
            selectedTheme={selectedTheme}
            selectedRoom={selectedRoom}
            onThemeChange={setSelectedTheme}
            onRoomChange={setSelectedRoom}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            canGenerate={!!uploadedImage}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="provider">AI Provider</Label>
              <Select
                value={selectedProvider}
                onValueChange={(value) =>
                  setSelectedProvider(value as Provider)
                }
                disabled={isLoading}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offline">Offline (Local GPU)</SelectItem>
                  <SelectItem value="replicate">Replicate (Online)</SelectItem>
                  <SelectItem value="hf">HuggingFace (Online)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                disabled={isLoading}
                min={0}
                step={10000}
                placeholder="Enter your budget"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Original Photo</h2>
          {uploadedImage ? (
            <UploadedImage src={uploadedImage} onRemove={handleRemoveImage} />
          ) : (
            <ImageDropzone
              onImageUpload={handleImageUpload}
              onError={handleError}
            />
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium">AI Design</h2>
          <OutputImage src={outputImage} isLoading={isLoading} />
        </div>
      </div>

      {generationResult && (
        <div className="grid gap-4 sm:grid-cols-2">
          <BudgetStatus
            estimatedCost={generationResult.estimated_cost}
            budget={generationResult.budget}
            status={generationResult.status}
          />
          <ProviderInfo
            provider={generationResult.provider_used}
            timeTaken={generationResult.time_taken_sec}
          />
        </div>
      )}
    </div>
  );
}
