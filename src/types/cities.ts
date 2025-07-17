interface GmlAttributes {
    "codeSpace": string;
}

interface Gml {
    "_attributes": GmlAttributes;
    "_text": string;
}

interface XLinkHref {
    "xlink:href": string;
}

interface AttributesXLinkHref {
    "_attributes": XLinkHref;
}

interface Text {
    "_text": string;
}

interface GmlId {
    "gml:id": string;
}

interface TargetLocation {
    "gml:identifier": Gml;
    "gml:name": Gml[];
    "target:country": Gml;
    "target:region": Gml;
    "target:representativePoint": AttributesXLinkHref;
    "target:timezone": Text;
    "_attributes": GmlId
}

export interface CityResponse {
    "target:Location": TargetLocation
}

interface TargetLocationCollection {
    "target:member": CityResponse[];
    "_attributes": GmlId
}

interface SamSampledFeature {
    "target:LocationCollection": TargetLocationCollection
}

interface GmlPointAttributes {
    "gml:id": string;
    "srsDimension": string;
    "srsName": string;
}

interface GmlPoint {
    "gml:name": Text;
    "gml:pos": Text;
    "_attributes": GmlPointAttributes;
}

interface GmlPointMembers {
    "gml:Point": GmlPoint[];
}

interface GmlMultipoint {
    "gml:pointMembers": GmlPointMembers;
    "_attributes": GmlId;
}

interface SamsShape {
    "gml:MultiPoint": GmlMultipoint;
}

interface SamsSF_SpatialSamplingFeature {
    "sam:sampledFeature": SamSampledFeature;
    "sams:shape": SamsShape;
    "_attributes": GmlId;
}

interface OmFeatureOfInterest {
    "sams:SF_SpatialSamplingFeature": SamsSF_SpatialSamplingFeature;
}

interface GmlTimeInstant {
    "gml:timePosition": Text;
    "_attributes": GmlId;
}

interface OmNamedValue {
    "om:name": AttributesXLinkHref;
    "om:value": GmlTimeInstant
}

interface GmlTimePeriod {
    "gml:beginPosition": Text;
    "gml:endPosition": Text;
    "_attributes": GmlId;
}

interface OmPhenomenonTime {
    "gml:TimePeriod": GmlTimePeriod;
}

interface GmlCoverageMappingRule {
    "gml:ruleDefinition": Text;
}

interface GmlCoverageFunction {
    "gml:CoverageMappingRule": GmlCoverageMappingRule;
}

interface GmlCovSimpleMultiPointAttributes {
    "gml:id": string;
    "srsDimension": string;
    "srsName": string;
}

interface GmlCovSimpleMultiPoint {
    "gmlcov:positions": Text;
    "_attributes": GmlCovSimpleMultiPointAttributes;
}

interface GmlDomainSet {
    "gmlcov:SimpleMultiPoint": GmlCovSimpleMultiPoint;
}

interface GmlDataBlock {
    "gml:doubleOrNilReasonTupleList": Text;
    "gml:rangeParameters": any; ////???????
}

interface GmlRangeSet {
    "gml:DataBlock": GmlDataBlock;
}

interface SweFieldAttributes {
    "name": string;
    "xlink:href": string;
}

interface SweDataRecord {
    "swe:field": SweFieldAttributes;
}

interface GmlCovRangeType {
    "swe:DataRecord": SweDataRecord;
}

interface GmlCovMultiPointCoverage {
    "gml:coverageFunction": GmlCoverageFunction;
    "gml:domainSet": GmlDomainSet;
    "gml:rangeSet": GmlRangeSet;
    "gmlcov:rangeType": GmlCovRangeType;
    "_attributes": GmlId;
}

interface OmResult {
    "gmlcov:MultiPointCoverage": GmlCovMultiPointCoverage
}

interface OmResultTime {
    "gml:TimeInstant": GmlTimeInstant
}

interface OmsoGridSeriesObservation {
    "om:featureOfInterest": OmFeatureOfInterest;
    "om:observedProperty": AttributesXLinkHref;
    "om:parameter": OmNamedValue;
    "om:phenomenonTime": OmPhenomenonTime;
    "om:procedure": AttributesXLinkHref;
    "om:result": OmResult;
    "om:resultTime": OmResultTime;
    "_attributes": GmlId;
}

interface WfcMember {
    "omso:GridSeriesObservation": OmsoGridSeriesObservation;
}

interface WfcFeatureCollectionAttributes {
    "numberMatched": string;
    "numberReturned": string;
    "timeStamp": string;
    "xmlns:gco": string;
    "xmlns:gmd": string;
    "xmlns:gml": string;
    "xmlns:gmlcov": string;
    "xmlns:om": string;
    "xmlns:ompr": string;
    "xmlns:omso": string;
    "xmlns:sam": string;
    "xmlns:sams": string;
    "xmlns:swe": string;
    "xmlns:target": string;
    "xmlns:wfs": string;
    "xmlns:xlink": string;
    "xmlns:xsi": string;
    "xsi:schemaLocation": string;
}

interface WfcFeatureCollection {
    "wfs:member": WfcMember;
    "_attributes": WfcFeatureCollectionAttributes;
}

interface DeclarationAttributes {
    "encoding": string;
    "version": string;
}

interface Declaration {
    "_attributes": DeclarationAttributes
}

export interface CitiesResponse {
    "wfs:FeatureCollection": WfcFeatureCollection;
    "_declaration": Declaration
}
