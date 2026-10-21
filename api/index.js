"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/src/app.ts
var import_express3 = __toESM(require("express"));
var import_helmet = __toESM(require("helmet"));
var import_cors = __toESM(require("cors"));

// server/src/routes/dnsRoutes.ts
var import_express = require("express");

// server/src/validators/dnsValidator.ts
var import_zod = require("zod");
var SUPPORTED_RECORD_TYPES = [
  "A",
  "AAAA",
  "MX",
  "NS",
  "TXT",
  "CNAME",
  "SOA",
  "CAA",
  "ALL"
];
function normalizeDomain(rawDomain) {
  let cleaned = rawDomain.trim().toLowerCase();
  if (cleaned.startsWith("http://")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("https://")) {
    cleaned = cleaned.slice(8);
  }
  cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0];
  cleaned = cleaned.split(":")[0];
  if (cleaned.endsWith(".")) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}
var DOMAIN_REGEX = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63}(?<!-))*$/;
var dnsLookupQuerySchema = import_zod.z.object({
  domain: import_zod.z.string({
    required_error: "Domain query parameter is required"
  }).min(1, "Domain name cannot be empty").max(253, "Domain name cannot exceed 253 characters").transform(normalizeDomain).refine((val) => val.length > 0, "Domain name cannot be empty").refine(
    (val) => {
      return DOMAIN_REGEX.test(val);
    },
    {
      message: "Invalid domain format. Domain names must contain only alphanumeric characters, dots, and hyphens (RFC 1123)."
    }
  ).refine(
    (val) => {
      const labels = val.split(".");
      return labels.every((l) => l.length >= 1 && l.length <= 63);
    },
    {
      message: "Each domain label between dots must be between 1 and 63 characters long."
    }
  ),
  type: import_zod.z.string().optional().default("A").transform((val) => val.toUpperCase().trim()).refine(
    (val) => {
      return SUPPORTED_RECORD_TYPES.includes(val);
    },
    {
      message: `Unsupported record type. Supported types are: ${SUPPORTED_RECORD_TYPES.join(", ")}`
    }
  )
});

// server/src/services/dnsService.ts
var import_promises = __toESM(require("node:dns/promises"));
var DEFAULT_TIMEOUT_MS = 5e3;
function withTimeout(promise, timeoutMs, operationName) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const err = new Error(`DNS query for ${operationName} timed out after ${timeoutMs}ms`);
      err.code = "ETIMEOUT";
      reject(err);
    }, timeoutMs);
    promise.then((res) => {
      clearTimeout(timer);
      resolve(res);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
function mapDnsError(err) {
  const dnsErr = err;
  const code = dnsErr.code || "UNKNOWN_ERROR";
  switch (code) {
    case "ENOTFOUND":
      return {
        status: "NXDOMAIN",
        code: "ENOTFOUND",
        message: "Non-Existent Domain (NXDOMAIN): The domain name could not be found by the resolver. Verify domain spelling or registration status.",
        category: "Resolution Failure"
      };
    case "ENODATA":
    case "ENORECORD":
      return {
        status: "NODATA",
        code,
        message: "No Data (NODATA): The domain name exists, but has no records for the requested record type.",
        category: "Empty Record Set"
      };
    case "ETIMEOUT":
      return {
        status: "TIMEOUT",
        code: "ETIMEOUT",
        message: "Query Timeout: The DNS server or resolver did not respond within the allotted time window. This may indicate network latency or blocked UDP port 53.",
        category: "Network Latency"
      };
    case "ESERVFAIL":
      return {
        status: "SERVFAIL",
        code: "ESERVFAIL",
        message: "Server Failure (SERVFAIL): The authoritative or recursive server encountered a failure (such as DNSSEC validation error or zone misconfiguration).",
        category: "Server Misconfiguration"
      };
    case "EREFUSED":
      return {
        status: "REFUSED",
        code: "EREFUSED",
        message: "Query Refused: The queried DNS server refused to answer this request due to policy, rate limiting, or zone transfer restrictions.",
        category: "Access Policy"
      };
    default:
      return {
        status: "ERROR",
        code,
        message: dnsErr.message || "An unexpected DNS error occurred.",
        category: "General DNS Error"
      };
  }
}
async function resolveSingleType(domain, type, timeoutMs) {
  const items = [];
  switch (type) {
    case "A": {
      const records = await withTimeout(
        import_promises.default.resolve4(domain, { ttl: true }),
        timeoutMs,
        `A record for ${domain}`
      );
      for (const rec of records) {
        items.push({
          name: domain,
          type: "A",
          value: rec.address,
          ttl: rec.ttl
        });
      }
      break;
    }
    case "AAAA": {
      const records = await withTimeout(
        import_promises.default.resolve6(domain, { ttl: true }),
        timeoutMs,
        `AAAA record for ${domain}`
      );
      for (const rec of records) {
        items.push({
          name: domain,
          type: "AAAA",
          value: rec.address,
          ttl: rec.ttl
        });
      }
      break;
    }
    case "MX": {
      const records = await withTimeout(
        import_promises.default.resolveMx(domain),
        timeoutMs,
        `MX record for ${domain}`
      );
      records.sort((a, b) => a.priority - b.priority);
      for (const rec of records) {
        items.push({
          name: domain,
          type: "MX",
          value: rec.exchange,
          priority: rec.priority,
          details: {
            exchange: rec.exchange,
            priority: rec.priority
          }
        });
      }
      break;
    }
    case "NS": {
      const records = await withTimeout(
        import_promises.default.resolveNs(domain),
        timeoutMs,
        `NS record for ${domain}`
      );
      for (const host of records) {
        items.push({
          name: domain,
          type: "NS",
          value: host
        });
      }
      break;
    }
    case "TXT": {
      const records = await withTimeout(
        import_promises.default.resolveTxt(domain),
        timeoutMs,
        `TXT record for ${domain}`
      );
      for (const chunks of records) {
        const fullString = chunks.join("");
        items.push({
          name: domain,
          type: "TXT",
          value: fullString,
          details: {
            chunks,
            chunkCount: chunks.length
          }
        });
      }
      break;
    }
    case "CNAME": {
      const records = await withTimeout(
        import_promises.default.resolveCname(domain),
        timeoutMs,
        `CNAME record for ${domain}`
      );
      for (const target of records) {
        items.push({
          name: domain,
          type: "CNAME",
          value: target
        });
      }
      break;
    }
    case "SOA": {
      const soa = await withTimeout(
        import_promises.default.resolveSoa(domain),
        timeoutMs,
        `SOA record for ${domain}`
      );
      items.push({
        name: domain,
        type: "SOA",
        value: `${soa.nsname} ${soa.hostmaster} (serial: ${soa.serial})`,
        ttl: soa.minttl,
        details: {
          primaryMaster: soa.nsname,
          responsiblePerson: soa.hostmaster,
          serial: soa.serial,
          refresh: soa.refresh,
          retry: soa.retry,
          expire: soa.expire,
          minimumTtl: soa.minttl
        }
      });
      break;
    }
    case "CAA": {
      const records = await withTimeout(
        import_promises.default.resolveCaa(domain),
        timeoutMs,
        `CAA record for ${domain}`
      );
      for (const rec of records) {
        const tag = rec.issue ? "issue" : rec.issuewild ? "issuewild" : rec.iodef ? "iodef" : "tag";
        const val = rec.issue || rec.issuewild || rec.iodef || JSON.stringify(rec);
        items.push({
          name: domain,
          type: "CAA",
          value: `${rec.critical} ${tag} "${val}"`,
          details: {
            flags: rec.critical,
            tag,
            value: val,
            ...rec
          }
        });
      }
      break;
    }
  }
  return items;
}
async function executeDnsLookup(domain, recordType, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const startTime = Date.now();
  const durationNotice = "Duration is the application-measured round-trip time through Node.js and the local resolver. It is not authoritative DNS server latency.";
  const resolverNotice = "Node.js uses the host operating system DNS resolver configuration. Results may be influenced by local DNS caching and recursive resolver policies.";
  if (recordType === "ALL") {
    const singleTypes = [
      "A",
      "AAAA",
      "MX",
      "NS",
      "TXT",
      "CNAME",
      "SOA",
      "CAA"
    ];
    const results = await Promise.allSettled(
      singleTypes.map((t) => resolveSingleType(domain, t, timeoutMs))
    );
    const allRecords = [];
    let hasSuccessfulType = false;
    let notFoundCount = 0;
    results.forEach((res, index) => {
      const type = singleTypes[index];
      if (res.status === "fulfilled") {
        if (res.value.length > 0) {
          hasSuccessfulType = true;
          allRecords.push(...res.value);
        }
      } else {
        const err = res.reason;
        if (err.code === "ENOTFOUND") {
          notFoundCount++;
        }
      }
    });
    const durationMs = Date.now() - startTime;
    if (hasSuccessfulType) {
      return {
        domain,
        recordType: "ALL",
        status: "SUCCESS",
        records: allRecords,
        durationMs,
        durationNotice,
        resolverNotice,
        message: `Discovered ${allRecords.length} record(s) across all queried types for ${domain}. Note that individual queries were dispatched concurrently because modern DNS resolvers restrict broad ANY queries (RFC 8482).`
      };
    }
    if (notFoundCount === singleTypes.length) {
      return {
        domain,
        recordType: "ALL",
        status: "NXDOMAIN",
        records: [],
        durationMs,
        durationNotice,
        resolverNotice,
        message: `Non-Existent Domain (NXDOMAIN): Could not resolve any records for ${domain}. The domain likely does not exist.`,
        error: {
          code: "ENOTFOUND",
          message: "The requested domain could not be resolved in the DNS namespace.",
          category: "Resolution Failure"
        }
      };
    }
    return {
      domain,
      recordType: "ALL",
      status: "NODATA",
      records: [],
      durationMs,
      durationNotice,
      resolverNotice,
      message: `No records were found for ${domain} across the standard queried record types (A, AAAA, MX, NS, TXT, CNAME, SOA, CAA).`,
      error: {
        code: "ENODATA",
        message: "No records exist for the queried types.",
        category: "Empty Record Set"
      }
    };
  }
  try {
    const records = await resolveSingleType(domain, recordType, timeoutMs);
    const durationMs = Date.now() - startTime;
    if (records.length === 0) {
      return {
        domain,
        recordType,
        status: "NODATA",
        records: [],
        durationMs,
        durationNotice,
        resolverNotice,
        message: `The domain ${domain} exists, but no ${recordType} records were found.`
      };
    }
    return {
      domain,
      recordType,
      status: "SUCCESS",
      records,
      durationMs,
      durationNotice,
      resolverNotice,
      message: `Successfully retrieved ${records.length} ${recordType} record(s) for ${domain}.`
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    const errorDetails = mapDnsError(err);
    return {
      domain,
      recordType,
      status: errorDetails.status,
      records: [],
      durationMs,
      durationNotice,
      resolverNotice,
      message: errorDetails.message,
      error: {
        code: errorDetails.code,
        message: errorDetails.message,
        category: errorDetails.category
      }
    };
  }
}

// server/src/controllers/dnsController.ts
async function handleDnsLookup(req, res, next) {
  try {
    const validationResult = dnsLookupQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors.map((e) => e.message).join(". ");
      res.status(400).json({
        domain: typeof req.query.domain === "string" ? req.query.domain : "",
        recordType: typeof req.query.type === "string" ? req.query.type : "A",
        status: "ERROR",
        records: [],
        durationMs: 0,
        durationNotice: "Validation failed before DNS lookup was dispatched.",
        resolverNotice: "No query was sent to resolver.",
        message: formattedErrors,
        error: {
          code: "INVALID_INPUT",
          message: formattedErrors,
          category: "Input Validation"
        }
      });
      return;
    }
    const { domain, type } = validationResult.data;
    const timeoutMs = parseInt(process.env.DNS_TIMEOUT_MS || "5000", 10);
    const lookupResult = await executeDnsLookup(domain, type, timeoutMs);
    let statusCode = 200;
    if (lookupResult.status === "NXDOMAIN") {
      statusCode = 404;
    } else if (lookupResult.status === "TIMEOUT") {
      statusCode = 504;
    } else if (lookupResult.status === "SERVFAIL" || lookupResult.status === "REFUSED") {
      statusCode = 502;
    } else if (lookupResult.status === "ERROR") {
      statusCode = 500;
    }
    res.status(statusCode).json(lookupResult);
  } catch (error) {
    next(error);
  }
}

// server/src/middleware/rateLimiter.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var dnsRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 60 * 1e3,
  // 1 minute window
  max: 60,
  // Limit each IP to 60 requests per windowMs
  standardHeaders: true,
  // Return standard RateLimit headers in the `RateLimit-*` format
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  validate: {
    xForwardedForHeader: false
  },
  message: {
    status: "ERROR",
    message: "Too many DNS lookup requests from this IP address. Please slow down and wait a minute before trying again.",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Rate limit of 60 requests per minute reached.",
      category: "Security & Throttling"
    }
  }
});

// server/src/routes/dnsRoutes.ts
var router = (0, import_express.Router)();
router.get("/lookup", dnsRateLimiter, handleDnsLookup);
var dnsRoutes_default = router;

// server/src/routes/healthRoutes.ts
var import_express2 = require("express");
var router2 = (0, import_express2.Router)();
router2.get("/", (_req, res) => {
  const health = {
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: "DNS Lookup Learning Tool API",
    version: "1.0.0"
  };
  res.status(200).json(health);
});
var healthRoutes_default = router2;

// server/src/middleware/errorHandler.ts
function errorHandler(err, _req, res, _next) {
  console.error("[SERVER ERROR]:", err.message);
  res.status(500).json({
    status: "ERROR",
    message: "An internal server error occurred while processing your request.",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: process.env.NODE_ENV === "development" ? err.message : "Please try again later or contact support.",
      category: "Server Exception"
    }
  });
}
function notFoundHandler(req, res) {
  res.status(404).json({
    status: "ERROR",
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource does not exist.",
      category: "Routing"
    }
  });
}

// server/src/app.ts
function createApp() {
  const app2 = (0, import_express3.default)();
  app2.set("trust proxy", 1);
  app2.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"]
        }
      },
      crossOriginEmbedderPolicy: false
    })
  );
  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) : ["http://localhost:5173", "http://127.0.0.1:5173"];
  app2.use(
    (0, import_cors.default)({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes("*") || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      },
      methods: ["GET"],
      allowedHeaders: ["Content-Type", "Accept"]
    })
  );
  app2.use(import_express3.default.json({ limit: "10kb" }));
  app2.use((req, _res, next) => {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
  app2.use(["/api/health", "/health"], healthRoutes_default);
  app2.use(["/api/dns", "/dns"], dnsRoutes_default);
  app2.use(notFoundHandler);
  app2.use(errorHandler);
  return app2;
}
var app_default = createApp();

// server/src/vercel.ts
var app = createApp();
module.exports = app;
module.exports.default = app;
