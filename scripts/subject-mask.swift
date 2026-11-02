// Writes a greyscale subject mask (Apple Vision "lift subject", on-device, macOS 14+) for an image.
// Used by scripts/build-stickers.ts. Usage: subject-mask <in.png> <out-mask.png>
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 3, let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[1]) as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fputs("usage: subject-mask in.png out.png\n", stderr); exit(1) }
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: image)
try handler.perform([request])
guard let result = request.results?.first else { fputs("no subject found in \(args[1])\n", stderr); exit(2) }
let buffer = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)
let ci = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
guard let cg = ctx.createCGImage(ci, from: ci.extent, format: .L8, colorSpace: CGColorSpaceCreateDeviceGray()),
      let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: args[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)
else { fputs("could not write \(args[2])\n", stderr); exit(3) }
CGImageDestinationAddImage(dest, cg, nil)
CGImageDestinationFinalize(dest)
