import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { Separator } from "@/components/ui/separator";

interface BasicInformationProps {
  className?: string;
}

export function BasicInformation({ className }: BasicInformationProps) {
  const [logoUrl, setLogoUrl] = useState("");
  const [verificationDocUrl, setVerificationDocUrl] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className={className}>
      <h2 className="text-2xl font-display font-semibold text-ceremonial-maroon mb-6">
        Basic Information
      </h2>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base">Business Logo (Optional)</Label>
          <ImageUpload onUploadComplete={(url) => setLogoUrl(url)} />
          {logoUrl && (
            <img src={logoUrl} alt="Logo preview" className="h-20 w-20 object-cover rounded" />
          )}
          <input type="hidden" name="logo_url" value={logoUrl} />
        </div>

        <div className="space-y-3">
          <Label className="text-base">Business Name</Label>
          <Input 
            name="business_name" 
            required 
            placeholder="Enter your business name"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Owner's Full Name</Label>
          <Input 
            name="owner_name" 
            required 
            placeholder="Enter owner's full name"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Email</Label>
          <Input 
            name="email" 
            type="email" 
            required 
            placeholder="Enter your email address"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">Phone</Label>
          <Input 
            name="phone" 
            type="tel" 
            required 
            placeholder="Enter your phone number"
            className="w-full"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-base">WhatsApp Number</Label>
          <Input 
            name="whatsapp_number" 
            type="tel" 
            placeholder="Enter WhatsApp number (if different from phone)"
            className="w-full"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base">GST Number (Optional)</Label>
          <Input 
            name="gst_number" 
            placeholder="Enter GST number if registered"
            className="w-full"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base">Website URL (Optional)</Label>
          <Input 
            name="website_url" 
            type="url" 
            placeholder="https://yourwebsite.com"
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base">Social Media Links (Optional)</Label>
          <div className="space-y-2">
            <Input 
              name="facebook_url" 
              type="url" 
              placeholder="Facebook profile URL"
              className="w-full"
            />
            <Input 
              name="instagram_url" 
              type="url" 
              placeholder="Instagram profile URL"
              className="w-full"
            />
            <Input 
              name="youtube_url" 
              type="url" 
              placeholder="YouTube channel URL"
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base">Verification Document (Optional)</Label>
          <p className="text-sm text-muted-foreground">
            Upload business license, registration certificate, or any official document
          </p>
          <ImageUpload 
            onUploadComplete={(url) => setVerificationDocUrl(url)}
            allowedFileTypes={["image/jpeg", "image/png", "application/pdf"]}
          />
          {verificationDocUrl && (
            <p className="text-sm text-green-600">Document uploaded successfully</p>
          )}
          <input type="hidden" name="verification_document_url" value={verificationDocUrl} />
        </div>

        <Separator />

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            required
          />
          <label htmlFor="terms" className="text-sm cursor-pointer">
            I accept the{" "}
            <a href="/policies/terms-conditions" target="_blank" className="text-primary underline">
              Terms & Conditions
            </a>{" "}
            and agree to provide accurate information
          </label>
        </div>
        <input type="hidden" name="terms_accepted" value={termsAccepted.toString()} />
      </div>
    </div>
  );
}