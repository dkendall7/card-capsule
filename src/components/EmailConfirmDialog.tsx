import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function EmailConfirmDialog({ open, onOpenChange, email }: EmailConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-semibold">Check Your Email!</DialogTitle>
          <DialogDescription className="text-base">
            We've sent a verification link to:<br />
            <span className="font-semibold text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">Click the verification link in your email</p>
                <p className="text-sm text-muted-foreground">This confirms your account and logs you in automatically</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Don't see the email? Check your spam folder or</p>
            <Button variant="link" className="p-0 h-auto font-normal underline">
              try signing up again
            </Button>
          </div>
          
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="outline" 
            className="w-full mt-4"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}